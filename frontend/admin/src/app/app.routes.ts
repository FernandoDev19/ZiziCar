import { Routes } from '@angular/router';
import { AuthGuard } from './pages/auth/guards/auth.guard';
import { Role } from './common/enums/roles';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent), canActivate: [AuthGuard] },
  { path: 'users-and-roles', loadComponent: () => import('./pages/users-roles/users-roles.component').then(c => c.UsersRolesComponent), canActivate: [AuthGuard], data: { role: Role.ADMIN } },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent), canActivate: [AuthGuard], data: { role: [Role.ADMIN, Role.PROVIDER] } },
  { path: 'requests', loadChildren: () => import('./pages/requests/shell/request.routes') },
  { path: 'customers', loadComponent: () => import('./pages/customers/customers.component').then(c => c.CustomersComponent), canActivate: [AuthGuard], data: { role: Role.ADMIN } },
  { path: 'providers', loadComponent: () => import('./pages/providers/providers.component').then(c => c.ProvidersComponent), canActivate: [AuthGuard], data: { role: Role.ADMIN } },
  { path: 'quotes', loadComponent: () => import('./pages/quotes/quotes.component').then(c => c.QuotesComponent), canActivate: [AuthGuard], data: { role: [Role.ADMIN, Role.PROVIDER] } },
  { path: 'newsletters', loadComponent: () => import('./pages/newsletters/newsletters.component').then(c => c.NewslettersComponent), canActivate: [AuthGuard], data: { role: [Role.ADMIN] } },
  { path: 'sales', loadComponent: () => import('./pages/sales/sales.component').then(c => c.SalesComponent), canActivate: [AuthGuard], data: { role: [Role.ADMIN, Role.PROVIDER, Role.EMPLOYE] } },
  { path: 'vehicles', loadComponent: () => import('./vehicles/vehicles.component').then(c => c.VehiclesComponent), canActivate: [AuthGuard], data: { role: Role.ADMIN } },
  { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then(c => c.ReportsComponent) , canActivate: [AuthGuard], data: { role: Role.ADMIN } },
  { path: 'help', loadComponent: () => import('./pages/help/help.component').then(c => c.HelpComponent), canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
