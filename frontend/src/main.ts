import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/auth/auth.interceptor';
import { LoginComponent } from './app/core/auth/login.component';
import { LayoutComponent } from './app/core/layout/layout.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./app/features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./app/features/clientes/clientes.component')
            .then(m => m.ClientesComponent)
      },
      {
        path: 'sucursales',
        loadComponent: () =>
          import('./app/features/sucursales/sucursales.component')
            .then(m => m.SucursalesComponent)
      },
      {
        path: 'encomiendas',
        loadComponent: () =>
          import('./app/features/encomiendas/encomiendas.component')
            .then(m => m.EncomiendasComponent)
      },
      {
        path: 'envios',
        loadComponent: () =>
          import('./app/features/envios/envios.component')
            .then(m => m.EnviosComponent)
      },
      {
        path: 'seguimientos',
        loadComponent: () =>
          import('./app/features/seguimientos/seguimientos.component')
            .then(m => m.SeguimientosComponent)
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./app/features/pagos/pagos.component')
            .then(m => m.PagosComponent)
      },
      {
        path: 'facturas',
        loadComponent: () =>
          import('./app/features/facturas/facturas.component')
            .then(m => m.FacturasComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./app/features/usuarios/usuarios.component')
            .then(m => m.UsuariosComponent)
      }
    ]
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
});