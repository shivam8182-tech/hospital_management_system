import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
    
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'patient',
        pathMatch: 'full'
      },
      
      {
        path: 'patient/add',
        loadComponent: () =>
          import('./features/patients/add-patient/add-patient.component').then(m => m.AddPatientComponent)
      },
        {
        path: 'staff/add',
        loadComponent: () =>
          import('./features/staff/add-staff/add-staff.component').then(m => m.AddStaffComponent)
      },
       {
        path: 'provider/add',
        loadComponent: () =>
          import('./features/provider/add-provider/add-provider.component').then(m => m.AddProviderComponent)
      },
       {
        path: 'biller/add',
        loadComponent: () =>
          import('./features/biller/add-biller.component/add-biller.component').then(m => m.AddBillerComponent) 

       },      
      {
        path: 'patient',
        loadComponent: () =>
          import('./features/entities/entity-list-page.component').then(m => m.EntityListPageComponent)
      },
      {
        path: 'staff',
        loadComponent: () =>
          import('./features/entities/entity-list-page.component').then(m => m.EntityListPageComponent)
      },
      {
        path: 'provider',
        loadComponent: () =>
          import('./features/entities/entity-list-page.component').then(m => m.EntityListPageComponent)
      },
      {
        path: 'biller',
        loadComponent: () =>
          import('./features/entities/entity-list-page.component').then(m => m.EntityListPageComponent)
      },
      {
        path: 'details/:token',
        loadComponent: () =>
          import('./shared/components/details/entity-details.component').then(m => m.EntityDetailsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];