import {
  Injectable,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebrtcService {
  readonly peerConnection = signal<RTCPeerConnection | null>(null);
  readonly localStream = signal<MediaStream | null>(null);
  readonly remoteStream = signal<MediaStream | null>(null);
  readonly isCameraEnabled = signal<boolean>(true);
  readonly isMicrophoneEnabled = signal<boolean>(true);

  private pendingIceCandidates: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;

  // ==================== Initialize WebRTC ==================== //

  initialize(onIceCandidate: (candidate: RTCIceCandidateInit) => void): void {

    this.pendingIceCandidates = [];
    this.remoteDescriptionSet = false;

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate.toJSON());
      }
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        this.remoteStream.set(stream);
      }
    };

    this.peerConnection.set(peerConnection);
  }

  // ==================== Set Remote Description ==================== //

  async setRemoteDescription(sdp: RTCSessionDescriptionInit): Promise<void> {
    const peerConnection = this.peerConnection();
    if (!peerConnection) throw new Error('Peer connection not initialized');

    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    this.remoteDescriptionSet = true;

    for (const candidate of this.pendingIceCandidates) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
    this.pendingIceCandidates = [];
  }

  // ==================== Add ICE Candidate ==================== //

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    const peerConnection = this.peerConnection();
    if (!peerConnection) return;

    if (!this.remoteDescriptionSet) {
      this.pendingIceCandidates.push(candidate);
      return;
    }

    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // ==================== Local Stream ==================== //

  async getLocalStream(): Promise<MediaStream> {
    const existingStream = this.localStream();
    if (existingStream) {
      existingStream.getTracks().forEach((track) => track.stop());
      this.localStream.set(null);
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    this.localStream.set(stream);
      return stream;
    }

  // ==================== Attach Local Tracks ==================== //

  attachLocalTracks(): void {
    const peerConnection = this.peerConnection();
    const stream = this.localStream();

    if (!peerConnection || !stream) {
      return;
    }

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });
  }

  // ==================== Create Offer ==================== //

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnection();
    if (!peerConnection) throw new Error('Peer connection not initialized');

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  // ==================== Create Answer ==================== //

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const peerConnection = this.peerConnection();
    if (!peerConnection) throw new Error('Peer connection not initialized');

    const answer = await peerConnection.createAnswer();
    
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  // ==================== Toggle Camera ==================== //
  toggleCamera(): void {
    const stream = this.localStream();
    if (!stream) {
      return;
    }

    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length === 0) {
      return;
    }

    const nextEnabled = !this.isCameraEnabled();
    videoTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });

    this.isCameraEnabled.set(nextEnabled);
  }


  // ==================== Toggle Microphone ==================== //

  toggleMicrophone(): void {
    const stream = this.localStream();
    if (!stream) {
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      return;
    }

    const nextEnabled = !this.isMicrophoneEnabled();
    audioTracks.forEach((track) => {
      track.enabled = nextEnabled;
    });

    this.isMicrophoneEnabled.set(nextEnabled);
  }


  // ==================== Cancel Call ==================== //

  cancelCall(): void {
    this.localStream()?.getTracks().forEach((track) => track.stop());
    this.peerConnection()?.close();

    this.peerConnection.set(null);
    this.localStream.set(null);
    this.remoteStream.set(null);
    this.isCameraEnabled.set(true);
    this.isMicrophoneEnabled.set(true);
    this.pendingIceCandidates = [];
    this.remoteDescriptionSet = false;
  }
}