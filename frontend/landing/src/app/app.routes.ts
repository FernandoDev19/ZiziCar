import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/landing/landingpage.component').then((c) => c.LandingpageComponent) },
  { path: 'thanks', loadComponent: () => import('./pages/thanks/thanks.component').then((c) => c.ThanksComponent) },
  { path: '**', redirectTo: '' }
];
