import { inject, Service, signal } from '@angular/core';
import { WebrtcService } from '../webrtc-service/webrtc-service';

interface callType { 
    toUserId: number; 
    chatId: number; 
    role: 'caller' | 'callee' 
}

@Service()
export class CallService {
    readonly webrtcService: WebrtcService = inject(WebrtcService);

    readonly isCallActive = signal(false);
    readonly isMinimized = signal(false);
    readonly currentCall = signal<callType | null>(null);

    startCall(toUserId: callType["toUserId"], chatId: callType["chatId"], role: callType["role"]) {
        this.currentCall.set({ toUserId, chatId, role });
        this.isCallActive.set(true);
    }

    endCall() {
        this.webrtcService.cancelCall();
        this.isCallActive.set(false);
        this.currentCall.set(null);
        this.isMinimized.set(false);
    }
}
