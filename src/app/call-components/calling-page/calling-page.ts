import { CommonModule } from '@angular/common';
import {
  Component, ElementRef, ViewChild, effect, inject,
  OnInit, OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebrtcService } from '../../services/webrtc-service/webrtc-service';
import { ChatsService } from '../../services/chats-service/chats-service';

@Component({
  imports: [CommonModule],
  selector: 'app-calling-page',
  styleUrl: './calling-page.css',
  templateUrl: './calling-page.html',
})
export class CallingPage implements OnInit, OnDestroy {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly webrtcService = inject(WebrtcService);
  private readonly chatsService = inject(ChatsService);

  @ViewChild('remoteVideo') remoteVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('localVideo') localVideoRef!: ElementRef<HTMLVideoElement>;

  readonly isCameraOn = this.webrtcService.isCameraEnabled;
  readonly isMicrophoneOn = this.webrtcService.isMicrophoneEnabled;
  readonly remoteStream = this.webrtcService.remoteStream;

  private toUserId!: number;
  private chatId!: number;
  private isCaller = false;

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
      if (stream && this.remoteVideoRef?.nativeElement) {
        this.remoteVideoRef.nativeElement.srcObject = stream;
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
  }

  private initialized = false;
  async ngOnInit(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const params = this.route.snapshot.queryParamMap;
    this.toUserId = Number(params.get('toUserId'));
    this.chatId = Number(params.get('chatId'));
    this.isCaller = params.get('role') === 'caller';

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
      console.log('disappear (app-call)')
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
        this.webrtcService.cancelCall();
        this.router.navigate(['/home']);
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

  endCall(): void {
    this.chatsService.sendCallSignal({
      type: 'call.end',
      to_user_id: this.toUserId,
    });
    this.webrtcService.cancelCall();
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.webrtcService.cancelCall();
  }
}