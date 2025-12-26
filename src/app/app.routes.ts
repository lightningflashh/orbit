import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { HomeComponent } from './home/home';
import { NotFoundComponent } from './shared/not-found/not-found';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Orbit - Login'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Orbit - Register'
  },
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 - Not Found'
  }
];