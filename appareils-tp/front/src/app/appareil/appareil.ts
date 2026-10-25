import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appareil',
  imports: [FormsModule, RouterLink],
  templateUrl: './appareil.html',
})
export class Appareil {
  appareilName = model.required<string>(); // model() = input + output, allows [(...)]
  appareilStatus = input.required<string>();
  index = input.required<number>();

  switchOn = output<void>();
  switchOff = output<void>();
}
