import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="space-y-6">

  <section class="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-2xl shadow-blue-500/20">
    <div class="max-w-3xl">
      <p class="text-sm font-bold uppercase tracking-widest text-blue-100">Panel principal</p>
      <h1 class="mt-2 text-3xl font-black md:text-5xl">Sistema de Gestión de Encomiendas</h1>
      <p class="mt-3 text-blue-50">
        Administración de clientes, sucursales, encomiendas, envíos, seguimiento, pagos, facturas y usuarios.
      </p>
    </div>
  </section>

  <section class="grid gap-4 md:grid-cols-4">
    <a *ngFor="let card of cards()" [routerLink]="card.path" class="stat-card transition hover:-translate-y-1 hover:shadow-2xl">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-slate-500">{{ card.label }}</p>
          <p class="mt-2 text-4xl font-black text-slate-900">{{ card.total }}</p>
        </div>
        <div class="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-2xl">{{ card.icon }}</div>
      </div>
    </a>
  </section>

  <section class="grid gap-4 md:grid-cols-4">
    <a *ngFor="let card of cards2()" [routerLink]="card.path" class="stat-card transition hover:-translate-y-1 hover:shadow-2xl">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-slate-500">{{ card.label }}</p>
          <p class="mt-2 text-4xl font-black text-slate-900">{{ card.total }}</p>
        </div>
        <div class="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-2xl">{{ card.icon }}</div>
      </div>
    </a>
  </section>

  <section class="grid gap-4 lg:grid-cols-3">

    <div class="card lg:col-span-2">
      <h2 class="text-xl font-black">Flujo del sistema</h2>

      <div class="mt-5 grid gap-3 md:grid-cols-4">
        <div *ngFor="let step of flow" class="rounded-3xl border border-slate-100 bg-slate-50 p-4">
          <div class="mb-3 text-3xl">{{ step.icon }}</div>
          <h3 class="font-black">{{ step.title }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ step.text }}</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-xl font-black">Relaciones activas</h2>
      <p class="mt-2 text-sm text-slate-500">
        El sistema conecta clientes con encomiendas, envíos, seguimientos, pagos y facturas.
      </p>

      <div class="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
        Proyecto listo para demostrar relaciones entre tablas.
      </div>
    </div>

  </section>

  <section class="card">
    <h2 class="text-xl font-black">Resumen del proceso</h2>

    <div class="mt-4 overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="bg-blue-50 text-left text-blue-900">
            <th class="p-3">Módulo</th>
            <th class="p-3">Función</th>
            <th class="p-3">Relación</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let r of resumen" class="border-b">
            <td class="p-3 font-bold">{{ r.modulo }}</td>
            <td class="p-3">{{ r.funcion }}</td>
            <td class="p-3">{{ r.relacion }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

</div>
  `
})
export class DashboardComponent implements OnInit {
  api = inject(ApiService);

  cards = signal<any[]>([
    { label: 'Clientes', total: '...', icon: '👥', path: '/clientes', endpoint: 'clientes' },
    { label: 'Sucursales', total: '...', icon: '🏢', path: '/sucursales', endpoint: 'sucursales' },
    { label: 'Encomiendas', total: '...', icon: '📦', path: '/encomiendas', endpoint: 'encomiendas' },
    { label: 'Envíos', total: '...', icon: '🚚', path: '/envios', endpoint: 'envios' }
  ]);

  cards2 = signal<any[]>([
    { label: 'Seguimientos', total: '...', icon: '📍', path: '/seguimientos', endpoint: 'seguimientos' },
    { label: 'Pagos', total: '...', icon: '💳', path: '/pagos', endpoint: 'pagos' },
    { label: 'Facturas', total: '...', icon: '🧾', path: '/facturas', endpoint: 'facturas' },
    { label: 'Usuarios', total: '...', icon: '🔐', path: '/usuarios', endpoint: 'usuarios' }
  ]);

  flow = [
    { icon: '👤', title: 'Cliente', text: 'Registra remitente y destinatario.' },
    { icon: '📦', title: 'Encomienda', text: 'Relaciona paquete con clientes.' },
    { icon: '🚚', title: 'Envío', text: 'Define origen, destino, costo y estado.' },
    { icon: '🧾', title: 'Pago/Factura', text: 'Cierra el proceso financiero.' }
  ];

  resumen = [
    { modulo: 'Clientes', funcion: 'Registro de personas', relacion: 'Remitente o destinatario' },
    { modulo: 'Encomiendas', funcion: 'Registro de paquetes', relacion: 'Cliente remitente y destinatario' },
    { modulo: 'Envíos', funcion: 'Traslado de encomiendas', relacion: 'Encomienda y sucursales' },
    { modulo: 'Seguimientos', funcion: 'Tracking del envío', relacion: 'Envío y estado' },
    { modulo: 'Pagos', funcion: 'Cobro del servicio', relacion: 'Pago vinculado a envío' },
    { modulo: 'Facturas', funcion: 'Comprobante fiscal', relacion: 'Factura vinculada a pago' }
  ];

  ngOnInit(): void {
    this.cargarTotales(this.cards, this.cards());
    this.cargarTotales(this.cards2, this.cards2());
  }

  cargarTotales(signalCards: any, lista: any[]) {
    lista.forEach((card, index) => {
      this.api.get(`${card.endpoint}?page=1&limit=1`).subscribe({
        next: (res: any) => {
          signalCards.update((cards: any[]) =>
            cards.map((c, i) =>
              i === index ? { ...c, total: res.total ?? 0 } : c
            )
          );
        },
        error: () => {
          signalCards.update((cards: any[]) =>
            cards.map((c, i) =>
              i === index ? { ...c, total: 0 } : c
            )
          );
        }
      });
    });
  }
}