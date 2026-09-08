import { effect, Service, signal, untracked } from '@angular/core';

export interface IncomingCallType {
  from_user_id: number;
  chat_id: number;
  sdp: RTCSessionDescriptionInit;
  call_type: string;
}

export interface CallSignalType {
  type: 'call.answer' | 'call.ice_candidate' | 'call.end' | 'call.reject';
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  from_user_id: number;
}

@Service()
export class ChatsCallService {
    public readonly showCallerCard = signal<boolean>(false);
    public readonly incomingCall = signal<IncomingCallType | null>(null);

    public readonly answerSignal =  signal<CallSignalType | null>(null);
    public readonly endOrRejectSignal =  signal<CallSignalType | null>(null);

    public readonly lastIceCandidate = signal<CallSignalType | null>(null);
    public readonly pendingIceCandidates = signal<CallSignalType[]>([]);

    setToCall(data: IncomingCallType | CallSignalType, type:  | CallSignalType['type'] | 'call.offer') {
        switch(type) {
            case 'call.offer': this.callOffer(data as IncomingCallType);
            break;

            case 'call.answer': this.callAnswer(data as CallSignalType);
            break;

            case 'call.ice_candidate': this.callIceCandidate(data as CallSignalType);
            break;

            case 'call.reject':
            case 'call.end':
                this.callEndOrReject(data as CallSignalType);
                break;
        }
    }

    callOffer(data: IncomingCallType) {
        console.log('callOffer');
        this.incomingCall.set(data);
        this.showCallerCard.set(true);
    }

    callAnswer(data: CallSignalType) {
        console.log('callAnswer');

        this.answerSignal.set(data);
    }

    callIceCandidate(data: CallSignalType) {
        console.log('callIceCandidate');

        if(this.lastIceCandidate() === null) {
            console.log('set last signal');
            this.lastIceCandidate.set(data);
            return;
        }

        console.log('set pending signals');
        this.pendingIceCandidates.update(signals => [...signals, data]);
    }

    callEndOrReject(data: CallSignalType) {
        console.log('callEndOrReject');

        this.endOrRejectSignal.set(data);
    }

    constructor() {
        effect(() => {
            const lastCallSignal = this.lastIceCandidate();
            const pendingCallSignals = this.pendingIceCandidates;

            untracked(() => {
                if(lastCallSignal === null && pendingCallSignals().length) {
                    console.log('get callsignal from pending to last signal');
                    this.lastIceCandidate.set(pendingCallSignals()[0]);
                    this.pendingIceCandidates.update(signals => signals.slice(1));
                }
            })
        })
    }

    resetSignals() {
        console.log('resetSignals');

        this.showCallerCard.set(false);
        this.incomingCall.set(null);

        this.answerSignal.set(null);
        this.endOrRejectSignal.set(null)

        this.lastIceCandidate.set(null);
        this.pendingIceCandidates.set([]);
    }
}
