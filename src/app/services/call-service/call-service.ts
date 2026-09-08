import { computed, inject, Service, signal } from '@angular/core';
import { WebrtcService } from '../webrtc-service/webrtc-service';
import { CallSignalType, ChatsService } from '../chats-service/chats-service';

interface callType { 
    toUserId: number; 
    chatId: number; 
    role: 'caller' | 'callee' 
}

@Service()
export class CallService {
    private readonly webrtcService: WebrtcService = inject(WebrtcService);

    readonly isMinimized = signal(false);
    readonly currentCall = signal<callType | null>(null);

    startCall(toUserId: callType["toUserId"], chatId: callType["chatId"], role: callType["role"]) {
        this.currentCall.set({ toUserId, chatId, role });
    }

    endCallToMe() {
        this.webrtcService.endWebRtcCall();
        this.currentCall.set(null);
        this.isMinimized.set(false);
    }
}
