import { Component, model } from '@angular/core';
import { Button, Input, Modal } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-new-chat',
  imports: [Modal, Input, Button],
  templateUrl: './new-chat.html',
  styleUrl: './new-chat.css',
})
export class NewChat {
  readonly newChatModal = model<boolean>(false);
}
