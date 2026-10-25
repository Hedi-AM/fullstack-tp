import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoomData } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private roomsUrl = environment.roomsUrl;

  getRooms(): Observable<RoomData[]> {
    return this.http.get<RoomData[]>(this.roomsUrl);
  }

  addRoom(name: string): Observable<RoomData> {
    return this.http.post<RoomData>(this.roomsUrl, { name });
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.roomsUrl}/${id}`);
  }
}
