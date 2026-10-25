import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomData } from '../models/room.model';
import { AppareilService } from '../services/appareil';
import { RoomService } from '../services/room';

@Component({
  selector: 'app-appareil-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './appareil-edit.html',
})
export class AppareilEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appareilService = inject(AppareilService);
  private roomService = inject(RoomService);

  id = '';
  rooms = signal<RoomData[]>([]);
  loading = signal(true);
  loaded = signal(false);
  error = signal('');

  name = signal('');
  status = signal<'On' | 'Off'>('Off');
  room = signal('');

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    this.roomService.getRooms().subscribe({
      next: (list) => this.rooms.set(list),
      error: () => this.error.set('Unable to load the rooms'),
    });

    this.appareilService.getAppareil(this.id).subscribe({
      next: (a) => {
        this.name.set(a.name);
        this.status.set(a.status);
        this.room.set(a.room?._id ?? '');
        this.loaded.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Appliance not found');
        this.loading.set(false);
      },
    });
  }

  onSave(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.appareilService
      .updateAppareil(this.id, {
        name: this.name().trim(),
        status: this.status(),
        room: this.room() === '' ? null : this.room(),
      })
      .subscribe({
        next: () => this.router.navigate(['/appareils']),
        error: () => this.error.set('Unable to save the appliance'),
      });
  }
}
