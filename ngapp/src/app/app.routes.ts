import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: '**', component: NotFound },
];