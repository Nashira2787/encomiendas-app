import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
<div class="min-h-screen bg-slate-100">
  <aside
    class="fixed inset-y-0 left-0 z-30 w-72 border-r border-white/20 bg-slate-950 text-white transition-transform duration-300 md:translate-x-0"
    [class.-translate-x-full]="!menu()"
  >
    <div class="flex h-full flex-col p-5">

      <div class="mb-8 flex items-center gap-3">
        <div class="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-xl font-black shadow-lg shadow-blue-600/30">
          E
        </div>

        <div>
          <h2 class="text-lg font-black leading-tight">
            Encomiendas
          </h2>

          <p class="text-xs text-slate-400">
            Sistema administrativo
          </p>
        </div>
      </div>

      <nav class="space-y-1">

        @for(item of items; track item.path){

          <a
            [routerLink]="item.path"
            routerLinkActive="bg-white/10 text-white shadow-lg"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span class="text-lg">
              {{item.icon}}
            </span>

            <span>
              {{item.label}}
            </span>
          </a>

        }

      </nav>

      <div class="mt-auto rounded-3xl bg-white/10 p-4">
        <p class="text-xs text-slate-400">
          Sesión activa
        </p>

        <p class="font-bold">
          Administrador
        </p>

        <button
          class="mt-3 w-full rounded-2xl bg-rose-600 px-4 py-2 text-sm font-bold hover:bg-rose-700"
          (click)="auth.logout()"
        >
          Salir
        </button>
      </div>

    </div>
  </aside>

  @if(menu()){
    <button
      class="fixed inset-0 z-20 bg-slate-900/40 md:hidden"
      (click)="menu.set(false)"
    ></button>
  }

  <main class="min-h-screen transition-all duration-300 md:pl-72">

    <header class="sticky top-0 z-10 border-b border-white/70 bg-white/80 backdrop-blur">

      <div class="flex h-16 items-center justify-between px-4 md:px-8">

        <div class="flex items-center gap-3">

          <button
            class="btn-soft"
            (click)="menu.set(!menu())"
          >
            ☰
          </button>

          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-blue-600">
              Sistema de transporte
            </p>

            <h1 class="text-lg font-black text-slate-900">
              Gestión de Encomiendas y Envíos
            </h1>
          </div>

        </div>

        <div class="flex items-center gap-2">

          <button
            class="btn-soft hidden sm:inline-flex"
            (click)="fullscreen()"
          >
            ⛶ Pantalla completa
          </button>

          <button
            class="btn-danger"
            (click)="auth.logout()"
          >
            INGRESAR
          </button>

        </div>

      </div>

    </header>

    <section class="p-4 md:p-8">
      <router-outlet />
    </section>

  </main>

</div>
  `
})
export class LayoutComponent {

  menu = signal(true);

  constructor(public auth: AuthService) {}

  items = [
    { path: '/dashboard', label: 'Menú Principal', icon: '🏠' },
    { path: '/clientes', label: 'Clientes', icon: '👥' },
    { path: '/sucursales', label: 'Sucursales', icon: '🏢' },
    { path: '/encomiendas', label: 'Encomiendas', icon: '📦' },
    { path: '/envios', label: 'Envíos', icon: '🚚' },
    { path: '/seguimientos', label: 'Seguimiento', icon: '📍' },
    { path: '/pagos', label: 'Pagos', icon: '💳' },
    { path: '/facturas', label: 'Facturación', icon: '🧾' },
    { path: '/usuarios', label: 'Usuarios', icon: '🔐' }
  ];

  fullscreen() {
    document.documentElement.requestFullscreen?.();
  }

}