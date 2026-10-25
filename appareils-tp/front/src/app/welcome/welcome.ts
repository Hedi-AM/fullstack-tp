import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Premier } from '../premier/premier';

@Component({
  selector: 'app-welcome',
  imports: [Premier, RouterLink],
  templateUrl: './welcome.html',
})
export class Welcome {}
