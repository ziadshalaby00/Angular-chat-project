import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text',
  imports: [CommonModule],
  templateUrl: './text.html',
  styleUrl: './text.css',
})
export class Text {
  readonly content = input.required<string>();
}
