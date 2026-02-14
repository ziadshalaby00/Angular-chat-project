import { Component, input } from '@angular/core';
import { File_message, ResultType } from '../../services/chat-service/chat-service';

@Component({
  selector: 'app-file',
  imports: [],
  templateUrl: './file.html',
  styleUrl: './file.css',
})
export class File {
  readonly file_message = input.required<File_message>();
}
