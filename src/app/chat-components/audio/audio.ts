import { Component, input } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';

@Component({
  selector: 'app-audio',
  imports: [],
  templateUrl: './audio.html',
  styleUrl: './audio.css',
})
export class Audio {
  readonly item = input.required<ResultType>();
}
