import { Component, input } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';

@Component({
  selector: 'app-file',
  imports: [],
  templateUrl: './file.html',
  styleUrl: './file.css',
})
export class File {
  readonly item = input.required<ResultType>();
}
