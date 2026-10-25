import { Component, OnInit, inject, signal } from '@angular/core';
import { Appareil } from '../appareil/appareil';
import { AppareilService } from '../services/appareil';

@Component({
  selector: 'app-appareil-dashboard',
  imports: [Appareil],
  templateUrl: './appareil-dashboard.html',
})
export class AppareilDashboard implements OnInit {
  private appareilService = inject(AppareilService);

  appareilList: { name: string; status: string }[] = [];
  allowed = signal(false);

  constructor() {
    setTimeout(() => this.allowed.set(true), 4000);
  }

  ngOnInit() {
    this.appareilList = this.appareilService.appareilList;
  }

  onSwitchOnAll() {
    this.appareilService.switchOnAll();
  }

  onSwitchOffAll() {
    if (confirm('Are you sure you want to switch off all your appliances?')) {
      this.appareilService.switchOffAll();
    }
  }

  onSwitch(index: number, status: 'On' | 'Off') {
    if (status === 'On') {
      this.appareilService.switchOnOne(index);
    } else {
      this.appareilService.switchOffOne(index);
    }
  }
}
