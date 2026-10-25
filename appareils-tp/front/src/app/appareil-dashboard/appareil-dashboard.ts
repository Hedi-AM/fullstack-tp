import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Appareil } from '../appareil/appareil';
import { AppareilData } from '../models/appareil.model';
import { AppareilService } from '../services/appareil';

@Component({
  selector: 'app-appareil-dashboard',
  imports: [Appareil, FormsModule],
  templateUrl: './appareil-dashboard.html',
})
export class AppareilDashboard implements OnInit {
  private appareilService = inject(AppareilService);

  appareils = signal<AppareilData[]>([]);
  loading = signal(true);
  error = signal('');

  // creation form
  newName = '';
  newStatus: 'On' | 'Off' = 'Off';

  ngOnInit() {
    this.loadAppareils();
  }

  loadAppareils() {
    this.loading.set(true);
    this.appareilService.getAppareils().subscribe({
      next: (list) => {
        this.appareils.set(list);
        this.error.set('');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load the appliances');
        this.loading.set(false);
      },
    });
  }

  onAdd() {
    const name = this.newName.trim();
    if (name === '') {
      return;
    }
    this.appareilService.addAppareil({ name, status: this.newStatus }).subscribe({
      next: (created) => {
        this.appareils.update((list) => [...list, created]);
        this.newName = '';
        this.newStatus = 'Off';
        this.error.set('');
      },
      error: () => this.error.set('Unable to create the appliance'),
    });
  }

  onToggle(a: AppareilData) {
    const status = a.status === 'On' ? 'Off' : 'On';
    this.appareilService.updateAppareil(a._id, { name: a.name, status }).subscribe({
      next: (updated) => {
        this.appareils.update((list) => list.map((x) => (x._id === updated._id ? updated : x)));
        this.error.set('');
      },
      error: () => this.error.set('Unable to update the appliance'),
    });
  }

  onDelete(a: AppareilData) {
    if (!confirm(`Delete "${a.name}"?`)) {
      return;
    }
    this.appareilService.deleteAppareil(a._id).subscribe({
      next: () => {
        this.appareils.update((list) => list.filter((x) => x._id !== a._id));
        this.error.set('');
      },
      error: () => this.error.set('Unable to delete the appliance'),
    });
  }

  onSwitchAll(status: 'On' | 'Off') {
    if (status === 'Off' && !confirm('Are you sure you want to switch off all your appliances?')) {
      return;
    }
    this.appareilService.switchAll(status).subscribe({
      next: () => this.loadAppareils(),
      error: () => this.error.set('Unable to switch the appliances'),
    });
  }
}
