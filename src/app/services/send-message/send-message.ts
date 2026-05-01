import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '../config-service/config-service';
import { SharedUtils } from '../shared-service/shared-utils';
import { ChatService, ResultType } from '../chat-service/chat-service';
export interface MessageType {
  'text': string;
  'file': File[];
  'audio': Blob | null
}
@Injectable({
  providedIn: 'root',
})
export class SendMessageService {
  private readonly config = inject(ConfigService);
  private readonly shared: SharedUtils = inject(SharedUtils);
  private readonly chatService: ChatService = inject(ChatService);

  readonly userSendMessage = signal<boolean>(false);

  readonly sendingCount = signal<number>(0);
  readonly replyToMessage = signal<ResultType | null>(null);

  private readonly textMessagesURL = `${this.config.apiUrl}/api/text_message`;
  private readonly fileMessagesURL = `${this.config.apiUrl}/api/file_message`;
  private readonly audioMessagesURL = `${this.config.apiUrl}/api/audio_message`;

  public sendMessage(message: MessageType, chatId: number) {
    const reply_to = this.replyToMessage()?.id;

    this.userSendMessage.set(true);

    if(message.text) {
      this.sendTextMessage(message.text, chatId, reply_to)
    }else if(message.file.length !== 0) {
      this.sendFileMessage(message.file[0], chatId, reply_to)
    }else if(message.audio) {
      this.sendAudioMessage(message.audio, chatId, reply_to)
    }
  }

  private sendTextMessage(content: string, chatId: number, reply_to: number | undefined) {
    let paylod: any = { 
      content:content,
    }
    if(reply_to) {
      paylod['reply_to'] = reply_to
    }

    this.shared.http.post(`${this.textMessagesURL}/${chatId}/send-text-message/`, 
      paylod,
      this.shared.CredAndCsrf()).subscribe({
      next: (res) => {
        this.replyToMessage.set(null);
      },
      error: (err) => {
        this.shared.setErrors(err.error);
      }
    })
  }

  private sendFileMessage(file: File, chatId: number, reply_to: number | undefined) {
    this.sendingCount.update(c => c + 1);

    const formData = new FormData();
    formData.append('file', file);

    if(reply_to) {
      formData.append('reply_to', JSON.stringify(reply_to));
    }

    this.shared.http.post(`${this.fileMessagesURL}/${chatId}/uplode-file/`, 
      formData, this.shared.CredAndCsrf()).subscribe({
      next: (res) => {
        this.replyToMessage.set(null);
      },
      error: (err) => {
        this.shared.setErrors(err.error);
        this.sendingCount.update(c => c - 1);
      }
    })
  }

  private sendAudioMessage(audio: Blob, chatId: number,  reply_to: number | undefined) {
    this.sendingCount.update(c => c + 1);

    const formData = new FormData();
    formData.append('audio', audio);
    
    if(reply_to) {
      formData.append('reply_to', JSON.stringify(reply_to));
    }

    this.shared.http.post(`${this.audioMessagesURL}/${chatId}/uplode-audio/`, 
      formData, this.shared.CredAndCsrf()).subscribe({
      next: (res) => {
        this.replyToMessage.set(null);
      },
      error: (err) => {
        this.shared.setErrors(err.error);
        this.sendingCount.update(c => c - 1);
      }
    })
  }

  private readonly messageSocket = signal<WebSocket | null>(null);
  public connectMessage(chatId: number) {
    this.disconnectMessage();

    const webSocket = new WebSocket(
      `${this.config.WsProtocol}://${this.config.socketUrl}/ws/chat_messages/${chatId}/`
    );
    this.messageSocket.set(webSocket);

    if (!this.messageSocket()) return;
    this.messageSocket()!.onopen = () => {
    };

    this.messageSocket()!.onmessage = (event) => {
      const data: any = JSON.parse(event.data);
      if(!data) return;

      if(data.type === 'broadcast_new_message') {
        const newMessage: ResultType = data.message_data;
        this.chatService.chatMessages.update((messages: ResultType[] | null) => {
          if(!messages) return null;
          return [...messages, newMessage];
        })

        if(newMessage.type !== 'text') {
          this.sendingCount.update(c => c - 1);
        }

      }else if(data.type === 'message_updated') {
        const message: ResultType = data.message_data;
        this.chatService.chatMessages.update((msgs) =>
          msgs!.map((msg) => {
            if (msg.id === message.id) {
              return {
                ...msg,
                text_message: {
                  ...msg.text_message!,
                  content: message.text_message?.content || ''
                }
              };
            }
            return msg;
          })
        );

      }else if(data.type === 'message_deleted') {
        const messageId: number = data.message_id;
          this.chatService.chatMessages.update((messages) => {
            if (!messages) return null;
            return messages.filter(message => message.id !== messageId);
          });
      }
    };

    this.messageSocket()!.onerror = (error) => {
      console.error(error);
    };

    this.messageSocket()!.onclose = () => {
    };
  }

  public disconnectMessage() {
    const socket = this.messageSocket();

    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      socket.close();
      this.messageSocket.set(null);
    }
  }

  public isMessageSocketConnected(): boolean {
    const socket = this.messageSocket();
    return !!socket && socket.readyState === WebSocket.OPEN;
  }
}
