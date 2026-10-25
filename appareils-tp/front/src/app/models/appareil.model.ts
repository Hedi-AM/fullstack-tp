import { RoomData } from './room.model';

export interface AppareilData {
  _id: string;
  name: string;
  status: 'On' | 'Off';
  room: RoomData | null;
}

// what we send to the API (room = id of a room, or null)
export interface AppareilInput {
  name: string;
  status: 'On' | 'Off';
  room?: string | null;
}
