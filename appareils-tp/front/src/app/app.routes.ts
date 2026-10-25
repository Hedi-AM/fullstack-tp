import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { AppareilDashboard } from './appareil-dashboard/appareil-dashboard';
import { AppareilDetail } from './appareil-detail/appareil-detail';
import { AppareilEdit } from './appareil-edit/appareil-edit';
import { Rooms } from './rooms/rooms';
import { Contact } from './contact/contact';
import { Authentif } from './authentif/authentif';

export const routes: Routes = [
  { path: 'home', component: Welcome },
  { path: 'appareils', component: AppareilDashboard },
  { path: 'appareils/:id/edit', component: AppareilEdit },
  { path: 'appareils/:id', component: AppareilDetail },
  { path: 'rooms', component: Rooms },
  { path: 'contact', component: Contact },
  { path: 'login', component: Authentif },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
