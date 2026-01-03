import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { HomeComponent } from './home/home';
import { NotFoundComponent } from './shared/not-found/not-found';
import { guestGuard } from './features/auth/guest.guard';
import { authGuard } from './features/auth/auth.guard';
import { UserLayoutComponent } from './layout/user-layout/user-layout';
import { ActivateComponent } from './features/auth/register/activate/activate';
import { StudyComponent } from './features/learn-vocabulary/study';
import { TopicCreateComponent } from './features/learn-vocabulary/topic/topic-create';
import { VocabEntryComponent } from './features/learn-vocabulary/vocabulary/vocab-entry';
import { LibraryComponent } from './features/learn-vocabulary/topic/library/topic-lib';

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
    path: 'account/activate',
    component: ActivateComponent,
    title: 'Orbit - Activate Account'
  },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'topics/my',
        component: LibraryComponent,
        canActivate: [authGuard],
        title: 'Orbit - My Topics'
      },
      {
        path: 'topics/create',
        component: TopicCreateComponent,
        canActivate: [authGuard],
        title: 'Orbit - Create Topic'
      },
      {
        path: 'topics/:id/add-vocab',
        component: VocabEntryComponent,
        canActivate: [authGuard],
        title: 'Orbit - Add Vocabulary'
      },
      {
        path: 'learn-vocabulary',
        component: StudyComponent,
        canActivate: [authGuard],
        title: 'Orbit - Learning Mission'
      }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: '404 - Not Found'
  }
];