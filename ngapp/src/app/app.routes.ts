import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Contact } from './contact/contact';
import { About } from './about/about';
import { NotFound } from './not-found/not-found';
import { Products } from './products/products';
import { ProductDetail } from './product-detail/product-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'contact', component: Contact },
  { path: 'contact/:id', component: Contact },
  { path: 'products', component: Products },
  { path: 'products/:id', component: ProductDetail },
  { path: 'about', component: About },
  { path: '**', component: NotFound },
];
