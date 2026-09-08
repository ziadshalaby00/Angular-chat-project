import { inject, Service, signal } from '@angular/core';
import { WebrtcService } from '../webrtc-service/webrtc-service';
import { ChatsCallService } from '../chats-call-service/chats-call-service';

interface callType { 
    toUserId: number; 
    chatId: number; 
    role: 'caller' | 'callee' 
}

@Service()
export class CallService {
    private readonly webrtcService: WebrtcService = inject(WebrtcService);
    private readonly chatsCallService: ChatsCallService = inject(ChatsCallService);

    readonly isMinimized = signal(false);
    readonly currentCall = signal<callType | null>(null);

    startCall(toUserId: callType["toUserId"], chatId: callType["chatId"], role: callType["role"]) {
        console.log('startCall');

        this.webrtcService.endWebRtcCall();
        this.currentCall.set({ toUserId, chatId, role });
    }

    endCallToMe() {
        console.log('endCallToMe');

        this.webrtcService.endWebRtcCall();
        this.chatsCallService.resetSignals();

        this.currentCall.set(null);
        this.isMinimized.set(false);
    }
}
