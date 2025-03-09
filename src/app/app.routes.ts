import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'events',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'event-list',
        pathMatch: 'full'
      },
      {
        path: 'event-list',
        loadComponent: () => import('./events/event-list/event-list.component').then(m => m.EventListComponent)
      },
      {
        path: 'add-event',
        loadComponent: () => import('./events/event-form/event-form.component').then(m => m.EventFormComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./events/event-form/event-form.component').then(m => m.EventFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./events/event-details/event-details.component').then(m => m.EventDetailsComponent)
      }
    ]
  },
  
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];