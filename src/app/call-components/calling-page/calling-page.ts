import { CommonModule } from '@angular/common';
import {
  Component, ElementRef, ViewChild, effect, inject,
  OnInit, OnDestroy,
  computed,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebrtcService } from '../../services/webrtc-service/webrtc-service';
import { ChatsService } from '../../services/chats-service/chats-service';
import { CallService } from '../../services/call-service/call-service';

@Component({
  imports: [CommonModule],
  selector: 'app-calling-page',
  styleUrl: './calling-page.css',
  templateUrl: './calling-page.html',
})
export class CallingPage {

  private readonly webrtcService = inject(WebrtcService);
  private readonly chatsService = inject(ChatsService);
  
  readonly callService: CallService = inject(CallService);

  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideoMini') remoteVideoMiniRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;

  readonly isCameraOn = this.webrtcService.isCameraEnabled;
  readonly isMicrophoneOn = this.webrtcService.isMicrophoneEnabled;

  readonly isFacingMode = computed<boolean>(() => this.webrtcService.facingMode() === 'user');

  readonly remoteStream = this.webrtcService.remoteStream;

  private toUserId!: number;
  private chatId!: number;
  private isCaller = false;

  private callInitialized = false;

  constructor() {
    effect(() => {
      const stream = this.webrtcService.localStream();

      if (!stream || !this.localVideoRef?.nativeElement) return;

      const video = this.localVideoRef.nativeElement;

      video.srcObject = stream;
      video.muted = true;
      video.volume = 0;
    });

    effect(() => {
      const stream = this.webrtcService.remoteStream();

      if (!stream) {
        return;
      }

      const remoteVideo = this.remoteVideoRef?.nativeElement;
      const remoteVideoMini = this.remoteVideoMiniRef?.nativeElement;

      if (remoteVideo && remoteVideo.srcObject !== stream) {
        remoteVideo.srcObject = stream;
      }

      if (remoteVideoMini && remoteVideoMini.srcObject !== stream) {
        remoteVideoMini.srcObject = stream;
      }
    });

    effect(() => {
      const signals = this.chatsService.callSignals();

      if (!signals.length) return;

      for (const signal of signals) {
        this.handleSignal(signal);
      }

      this.chatsService.callSignals.set([]);
    });

    effect(() => {
      const call = this.callService.currentCall();
  
      if (!call || this.callInitialized) return;

      this.callInitialized = true;

      this.toUserId = call.toUserId;
      this.chatId = call.chatId;
      this.isCaller = call.role === 'caller';

      this.initializeCall();
    });
  }

  private async initializeCall(): Promise<void> {
    console.log('initializeCall')
    this.webrtcService.initialize((candidate) => {
      this.chatsService.sendCallSignal({
        type: 'call.ice_candidate',
        to_user_id: this.toUserId,
        candidate,
      });
    });

    await this.webrtcService.getLocalStream();
    this.webrtcService.attachLocalTracks();

    if (this.isCaller) {
      const offer = await this.webrtcService.createOffer();

      this.chatsService.sendCallSignal({
        type: 'call.offer',
        to_user_id: this.toUserId,
        chat_id: this.chatId,
        sdp: offer,
        call_type: 'video',
      });
    } else {
      const pendingOffer = this.chatsService.incomingCall();

      if (pendingOffer) {
        await this.webrtcService.setRemoteDescription(pendingOffer.sdp);

        const answer = await this.webrtcService.createAnswer();

        this.chatsService.sendCallSignal({
          type: 'call.answer',
          to_user_id: pendingOffer.from_user_id,
          sdp: answer,
        });
      }

      this.chatsService.incomingCall.set(null);
    }
  }

  private async handleSignal(signal: any): Promise<void> {
    switch (signal.type) {
      case 'call.offer':
        await this.webrtcService.setRemoteDescription(signal.sdp);
        const answer = await this.webrtcService.createAnswer();
        this.chatsService.sendCallSignal({
          type: 'call.answer',
          to_user_id: signal.from_user_id,
          sdp: answer,
        });
        break;

      case 'call.answer':
        await this.webrtcService.setRemoteDescription(signal.sdp);
        break;

      case 'call.ice_candidate':
        await this.webrtcService.addIceCandidate(signal.candidate);
        break;

      case 'call.end':
      case 'call.reject':
        this.callInitialized = false;
        this.callService.endCall();
        break;
    }

    this.chatsService.callSignals.set([]);
  }

  toggleCamera(): void {
    this.webrtcService.toggleCamera();
  }

  toggleMicrophone(): void {
    this.webrtcService.toggleMicrophone();
  }

  switchCamera(): void {
    this.webrtcService.switchCamera();
  }

  endCall(): void {
    this.chatsService.sendCallSignal({
      type: 'call.end',
      to_user_id: this.toUserId,
    });

    this.callInitialized = false;
    this.callService.endCall();
  }

  miniPosition = signal({
    x: 16,
    y: 16,
  });

  private isDragging = false;

  private dragOffset = {
    x: 0,
    y: 0,
  };

  startDragging(event: PointerEvent) {
    const element = event.currentTarget as HTMLElement;

    this.isDragging = true;

    this.dragOffset.x = event.clientX - element.offsetLeft;
    this.dragOffset.y = event.clientY - element.offsetTop;

    element.setPointerCapture(event.pointerId);
  }

  onDragging(event: PointerEvent) {
    if (!this.isDragging) {
      return;
    }

    const element = event.currentTarget as HTMLElement;

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    let x = event.clientX - this.dragOffset.x;
    let y = event.clientY - this.dragOffset.y;

    // Keep inside viewport
    x = Math.max(0, Math.min(x, window.innerWidth - width));
    y = Math.max(0, Math.min(y, window.innerHeight - height));

    this.miniPosition.set({ x, y });
  }

  stopDragging(event: PointerEvent) {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    const element = event.currentTarget as HTMLElement;

    element.releasePointerCapture?.(event.pointerId);
  }

  restoreFromMini(event: MouseEvent) {
    this.callService.isMinimized.set(false);
  }
}