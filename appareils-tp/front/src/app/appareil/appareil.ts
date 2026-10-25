import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppareilData } from '../models/appareil.model';

@Component({
  selector: 'app-appareil',
  imports: [RouterLink],
  templateUrl: './appareil.html',
})
export class Appareil {
  appareil = input.required<AppareilData>();

  toggle = output<void>();
  remove = output<void>();
}
