import { Routes } from '@angular/router';
import { authRoutes } from './routes/auth.routes';
import { tasksRoutes } from './tasks/tasks.routes';

export const routes: Routes = [
  { 
    path: 'auth',
    children: [...authRoutes]
  },
  { 
    path: 'tasks',
    children: [...tasksRoutes]
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];