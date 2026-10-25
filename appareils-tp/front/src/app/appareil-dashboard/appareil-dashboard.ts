import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Appareil } from '../appareil/appareil';
import { AppareilData } from '../models/appareil.model';
import { RoomData } from '../models/room.model';
import { AppareilService } from '../services/appareil';
import { RoomService } from '../services/room';

@Component({
  selector: 'app-appareil-dashboard',
  imports: [Appareil, FormsModule],
  templateUrl: './appareil-dashboard.html',
})
export class AppareilDashboard implements OnInit {
  private appareilService = inject(AppareilService);
  private roomService = inject(RoomService);

  appareils = signal<AppareilData[]>([]);
  rooms = signal<RoomData[]>([]);
  loading = signal(true);
  error = signal('');
  filter = signal<'' | 'On' | 'Off'>('');

  // creation form (signals, so the view stays correct in a zoneless app)
  name = signal('');
  status = signal<'On' | 'Off'>('Off');
  room = signal('');

  ngOnInit() {
    this.loadAppareils();
    this.roomService.getRooms().subscribe({
      next: (list) => this.rooms.set(list),
      error: () => this.error.set('Unable to load the rooms'),
    });
  }

  loadAppareils() {
    this.loading.set(true);
    const f = this.filter();
    this.appareilService.getAppareils(f === '' ? undefined : f).subscribe({
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

  onFilter(value: '' | 'On' | 'Off') {
    this.filter.set(value);
    this.loadAppareils();
  }

  onAdd(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.appareilService
      .addAppareil({
        name: this.name().trim(),
        status: this.status(),
        room: this.room() === '' ? null : this.room(),
      })
      .subscribe({
        next: () => {
          this.name.set('');
          this.status.set('Off');
          this.room.set('');
          f.resetForm({ name: '', status: 'Off', room: '' });
          this.loadAppareils();
        },
        error: () => this.error.set('Unable to create the appliance'),
      });
  }

  onToggle(a: AppareilData) {
    const status = a.status === 'On' ? 'Off' : 'On';
    this.appareilService
      .updateAppareil(a._id, { name: a.name, status, room: a.room?._id ?? null })
      .subscribe({
        next: () => this.loadAppareils(),
        error: () => this.error.set('Unable to update the appliance'),
      });
  }

  onDelete(a: AppareilData) {
    if (!confirm(`Delete "${a.name}"?`)) {
      return;
    }
    this.appareilService.deleteAppareil(a._id).subscribe({
      next: () => this.appareils.update((list) => list.filter((x) => x._id !== a._id)),
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
