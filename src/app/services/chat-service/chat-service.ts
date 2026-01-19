import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public readonly currentChat = signal<number | null>(null) ;
  public readonly getChatMessagesLoading = signal<boolean>(false);

  public getChatMessages() {
    
  }
}
