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

  readonly facingMode = signal<'user' | 'environment'>('user');

  private pendingIceCandidates: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;

  // ==================== Initialize WebRTC ==================== //

  initialize(onIceCandidate: (candidate: RTCIceCandidateInit) => void): void {
    console.log('Initialize webRTC');

    this.pendingIceCandidates = [];
    this.remoteDescriptionSet = false;

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: [
            'turn:free.expressturn.com:3478?transport=udp',
            'turn:free.expressturn.com:3478?transport=tcp',
          ],
          username: '000000002104315238',
          credential: 'YKpm9Nl5CJqTllz+VikFWKASzqg=',
        },
      ],
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(event.candidate.candidate);
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

      if (!peerConnection) {
        console.log('%c[ICE] DROPPED — no peerConnection yet!', 'color:red;font-weight:bold', candidate);
        return;
      }

      if (!this.remoteDescriptionSet) {
        console.log('%c[ICE] queued internally (remote desc not set)', 'color:yellow', candidate);
        this.pendingIceCandidates.push(candidate);
        return;
      }

      console.log('%c[ICE] applied successfully', 'color:lightgreen', candidate);
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
      video: {
        facingMode: this.facingMode(),
        aspectRatio: { ideal: 16 / 9 },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    });

    this.localStream.set(stream);
    this.toggleCamera();
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
    console.log('Create Offer');

    const peerConnection = this.peerConnection();
    if (!peerConnection) throw new Error('Peer connection not initialized');

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  // ==================== Create Answer ==================== //

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    console.log('Create Answer');

    const peerConnection = this.peerConnection();
    if (!peerConnection) throw new Error('Peer connection not initialized');

    const answer = await peerConnection.createAnswer();
    
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  // ==================== Toggle Camera ==================== //
  toggleCamera(): boolean | undefined {
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
    return nextEnabled;
  }


  // ==================== Toggle Microphone ==================== //

  toggleMicrophone(): boolean | undefined {
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
    return nextEnabled;
  }


  // ==================== Switch Camera ==================== //
  
  async switchCamera(): Promise<void> {
    const peerConnection = this.peerConnection();
    const oldStream = this.localStream();
    if (!peerConnection || !oldStream) return;

    const newFacingMode = this.facingMode() === 'user' ? 'environment' : 'user';

    const baseConstraints = {
      aspectRatio: { ideal: 16 / 9 },
      width: { ideal: 1280 },
      height: { ideal: 720 },
    };

    let newStream: MediaStream;
    try {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: { ...baseConstraints, facingMode: { exact: newFacingMode } },
      });
    } catch {
      newStream = await navigator.mediaDevices.getUserMedia({
        video: { ...baseConstraints, facingMode: newFacingMode },
      });
    }

    const newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack) return;

    const sender = peerConnection
      .getSenders()
      .find((s) => s.track?.kind === 'video');
    if (sender) {
      await sender.replaceTrack(newVideoTrack);
    }

    const oldVideoTrack = oldStream.getVideoTracks()[0];
    oldVideoTrack?.stop();
    if (oldVideoTrack) oldStream.removeTrack(oldVideoTrack);
    oldStream.addTrack(newVideoTrack);

    newVideoTrack.enabled = this.isCameraEnabled();
    this.facingMode.set(newFacingMode);
  }

  // ==================== Cancel Call ==================== //

  endWebRtcCall(): void {
    console.log('End WebRTC Call');
    
    this.localStream()?.getTracks().forEach((track) => track.stop());
    this.peerConnection()?.close();

    this.peerConnection.set(null);
    this.localStream.set(null);
    this.remoteStream.set(null);
    this.isCameraEnabled.set(true);
    this.isMicrophoneEnabled.set(true);
    this.facingMode.set('user');

    this.pendingIceCandidates = [];
    this.remoteDescriptionSet = false;
  }
}