import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { HomeComponent } from './home/home';
import { NotFoundComponent } from './shared/not-found/not-found';
import { guestGuard } from './features/auth/auth.guard';
import { UserLayoutComponent } from './layout/user-layout/user-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Orbit - Login'
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard],
    title: 'Orbit - Register'
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 - Not Found'
  }
];