import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RoomData } from '../models/room.model';
import { RoomService } from '../services/room';

@Component({
  selector: 'app-rooms',
  imports: [FormsModule],
  templateUrl: './rooms.html',
})
export class Rooms implements OnInit {
  private roomService = inject(RoomService);

  rooms = signal<RoomData[]>([]);
  loading = signal(true);
  error = signal('');
  name = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.roomService.getRooms().subscribe({
      next: (list) => {
        this.rooms.set(list);
        this.error.set('');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load the rooms');
        this.loading.set(false);
      },
    });
  }

  onAdd(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this.roomService.addRoom(this.name().trim()).subscribe({
      next: () => {
        this.name.set('');
        f.resetForm({ name: '' });
        this.load();
      },
      error: () => this.error.set('Unable to create the room'),
    });
  }

  onDelete(r: RoomData) {
    if (!confirm(`Delete the room "${r.name}"? Its appliances are kept.`)) {
      return;
    }
    this.roomService.deleteRoom(r._id).subscribe({
      next: () => this.rooms.update((list) => list.filter((x) => x._id !== r._id)),
      error: () => this.error.set('Unable to delete the room'),
    });
  }
}
