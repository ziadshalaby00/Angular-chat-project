import { computed, inject, Service, signal } from '@angular/core';
import { WebrtcService } from '../webrtc-service/webrtc-service';
import { ChatsCallService } from '../chats-call-service/chats-call-service';
import { ChatsService, ParticipantType } from '../chats-service/chats-service';

interface callType { 
    toUserId: number; 
    chatId: number; 
    role: 'caller' | 'callee' 
}

@Service()
export class CallService {
    private readonly webrtcService: WebrtcService = inject(WebrtcService);
    private readonly chatsCallService: ChatsCallService = inject(ChatsCallService);
    private readonly chatsService: ChatsService = inject(ChatsService);

    readonly isMinimized = signal(false);
    readonly currentCall = signal<callType | null>(null);

    startCall(toUserId: callType["toUserId"], chatId: callType["chatId"], role: callType["role"]) {
        console.log('Start Call');

        this.webrtcService.endWebRtcCall();
        this.currentCall.set({ toUserId, chatId, role });
    }

    endCallToMe() {
        console.log('End Call To Me');

        this.webrtcService.endWebRtcCall();
        this.chatsCallService.resetSignals();

        this.currentCall.set(null);
        this.isMinimized.set(false);
    }

    public readonly participant = computed<ParticipantType | undefined>(() => {
        const call = this.chatsCallService.incomingCall();
        if (!call) return undefined;

        const chat = this.chatsService.chats().find((c) => c.id === call.chat_id);

        return chat?.participants.find(
        (p) => p.user_info.id === call.from_user_id
        )?.user_info;
    });

    public readonly OntherUser = computed<ParticipantType | undefined>(() => {
        const currentCall = this.currentCall();
        if (!currentCall) return undefined;

        const chat = this.chatsService.chats().find((c) => c.id === currentCall.chatId);

        return chat?.participants.find(
        (p) => p.user_info.id === currentCall.toUserId
        )?.user_info;
    });
}
