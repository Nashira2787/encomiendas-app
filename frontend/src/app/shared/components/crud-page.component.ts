import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000/api';

type FieldType = 'text' | 'number' | 'date' | 'select' | 'boolean';
interface FieldConfig { key: string; label: string; type?: FieldType; ref?: string; display?: (item: any) => string; placeholder?: string; }
interface ModuleConfig { title: string; icon: string; description: string; fields: FieldConfig[]; columns: string[]; accent: string; }

const moduleConfigs: Record<string, ModuleConfig> = {
  clientes: {
    title: 'Clientes', icon: '👥', accent: 'from-blue-600 to-cyan-500',
    description: 'Administra remitentes y destinatarios. Desde detalles puedes ver sus encomiendas relacionadas.',
    fields: [
      { key: 'nombre', label: 'Nombre' }, { key: 'apellido', label: 'Apellido' }, { key: 'ci', label: 'CI' },
      { key: 'telefono', label: 'Teléfono' }, { key: 'email', label: 'Email' }, { key: 'direccion', label: 'Dirección' }
    ],
    columns: ['id', 'nombre', 'apellido', 'ci', 'telefono', 'email']
  },
  sucursales: {
    title: 'Sucursales', icon: '🏢', accent: 'from-violet-600 to-fuchsia-500',
    description: 'Gestiona puntos de origen y destino usados por los envíos.',
    fields: [
      { key: 'nombre', label: 'Nombre' }, { key: 'direccion', label: 'Dirección' }, { key: 'ciudad', label: 'Ciudad' }, { key: 'telefono', label: 'Teléfono' }
    ],
    columns: ['id', 'nombre', 'ciudad', 'direccion', 'telefono']
  },
  encomiendas: {
    title: 'Encomiendas', icon: '📦', accent: 'from-amber-500 to-orange-500',
    description: 'Registra paquetes y enlázalos con remitente y destinatario.',
    fields: [
      { key: 'codigo', label: 'Código', placeholder: 'ENC004' },
      { key: 'remitenteId', label: 'Remitente', type: 'select', ref: 'clientes', display: clienteDisplay },
      { key: 'destinatarioId', label: 'Destinatario', type: 'select', ref: 'clientes', display: clienteDisplay },
      { key: 'descripcion', label: 'Descripción' }, { key: 'peso', label: 'Peso', type: 'number' }, { key: 'volumen', label: 'Volumen', type: 'number' },
      { key: 'valorDeclarado', label: 'Valor declarado', type: 'number' }
    ],
    columns: ['id', 'codigo', 'remitenteId', 'destinatarioId', 'descripcion', 'peso', 'valorDeclarado']
  },
  envios: {
    title: 'Envíos', icon: '🚚', accent: 'from-emerald-600 to-teal-500',
    description: 'Relaciona encomiendas con sucursales, costo y estado logístico.',
    fields: [
      { key: 'encomiendaId', label: 'Encomienda', type: 'select', ref: 'encomiendas', display: encomiendaDisplay },
      { key: 'sucursalOrigenId', label: 'Sucursal origen', type: 'select', ref: 'sucursales', display: sucursalDisplay },
      { key: 'sucursalDestinoId', label: 'Sucursal destino', type: 'select', ref: 'sucursales', display: sucursalDisplay },
      { key: 'fechaEnvio', label: 'Fecha envío', type: 'date' }, { key: 'fechaEstimada', label: 'Fecha estimada', type: 'date' },
      { key: 'costo', label: 'Costo', type: 'number' }, { key: 'estadoId', label: 'Estado', type: 'select', ref: 'estados' }
    ],
    columns: ['id', 'encomiendaId', 'sucursalOrigenId', 'sucursalDestinoId', 'costo', 'estadoId']
  },
  seguimientos: {
    title: 'Seguimiento', icon: '📍', accent: 'from-sky-600 to-blue-500',
    description: 'Registra movimientos, ubicación y observaciones de cada envío.',
    fields: [
      { key: 'envioId', label: 'Envío', type: 'select', ref: 'envios', display: envioDisplay },
      { key: 'estadoId', label: 'Estado', type: 'select', ref: 'estados' },
      { key: 'ubicacion', label: 'Ubicación' }, { key: 'observaciones', label: 'Observaciones' }
    ],
    columns: ['id', 'envioId', 'estadoId', 'ubicacion', 'fecha', 'observaciones']
  },
  pagos: {
    title: 'Pagos', icon: '💳', accent: 'from-lime-600 to-emerald-500',
    description: 'Registra pagos enlazados a envíos.',
    fields: [
      { key: 'envioId', label: 'Envío', type: 'select', ref: 'envios', display: envioDisplay },
      { key: 'monto', label: 'Monto', type: 'number' }, { key: 'metodo', label: 'Método' }
    ],
    columns: ['id', 'envioId', 'monto', 'metodo', 'fecha']
  },
  facturas: {
    title: 'Facturación', icon: '🧾', accent: 'from-rose-600 to-pink-500',
    description: 'Emite facturas relacionadas con pagos.',
    fields: [
      { key: 'pagoId', label: 'Pago', type: 'select', ref: 'pagos', display: pagoDisplay },
      { key: 'numeroFactura', label: 'Número factura' }, { key: 'nit', label: 'NIT' }, { key: 'razonSocial', label: 'Razón social' }
    ],
    columns: ['id', 'pagoId', 'numeroFactura', 'nit', 'razonSocial', 'fecha']
  },
  usuarios: {
    title: 'Usuarios', icon: '🔐', accent: 'from-slate-700 to-slate-900',
    description: 'Administra cuentas internas, roles y estado de acceso.',
    fields: [
      { key: 'nombreUsuario', label: 'Usuario' }, { key: 'password', label: 'Contraseña' },
      { key: 'rol', label: 'Rol', type: 'select', ref: 'roles' }, { key: 'estado', label: 'Activo', type: 'boolean' }
    ],
    columns: ['id', 'nombreUsuario', 'rol', 'estado']
  }
};

function clienteDisplay(x: any) { return `${x.nombre ?? ''} ${x.apellido ?? ''} - CI ${x.ci ?? ''}`.trim(); }
function sucursalDisplay(x: any) { return `${x.nombre ?? ''} (${x.ciudad ?? 'Sin ciudad'})`; }
function encomiendaDisplay(x: any) { return `${x.codigo ?? 'ENC'} - ${x.descripcion ?? ''}`; }
function envioDisplay(x: any) { return `Envío #${x.id} / Encomienda ${x.encomiendaId}`; }
function pagoDisplay(x: any) { return `Pago #${x.id} - Bs ${x.monto ?? 0}`; }

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="space-y-5">
  <section class="overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 text-white shadow-2xl" [ngClass]="config().accent">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4">
        <div class="grid h-16 w-16 place-items-center rounded-3xl bg-white/20 text-3xl backdrop-blur">{{config().icon}}</div>
        <div>
          <p class="text-sm font-bold uppercase tracking-widest text-white/70">Módulo</p>
          <h1 class="text-3xl font-black">{{config().title}}</h1>
          <p class="mt-1 max-w-3xl text-sm text-white/85">{{config().description}}</p>
        </div>
      </div>
      <button class="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-lg" (click)="nuevo()">+ Nuevo registro</button>
    </div>
  </section>

  <section class="card">
    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap gap-2">
        <button class="tab" [class.tab-active]="tab()==='lista'" (click)="tab.set('lista')">Listado</button>
        <button class="tab" [class.tab-active]="tab()==='form'" (click)="tab.set('form')">Formulario</button>
        <button class="tab" [class.tab-active]="tab()==='detalles'" (click)="tab.set('detalles')">Detalles y relaciones</button>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <input class="input sm:w-72" placeholder="Buscar registro..." [(ngModel)]="q" (keyup.enter)="buscar()">
        <button class="btn-soft" (click)="buscar()">Buscar</button>
      </div>
    </div>
  </section>

  @if(tab()==='lista'){
    <section class="card overflow-hidden">
      <div class="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-xl font-black">Registros</h2>
          <p class="text-sm text-slate-500">Selecciona un registro para abrir sus detalles relacionados.</p>
        </div>
        <span class="badge">Total: {{total()}}</span>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-100">
        <table class="w-full min-w-[760px] text-sm">
          <thead class="table-head"><tr>
            @for(c of columnas(); track c){<th class="p-3 text-left">{{label(c)}}</th>}
            <th class="p-3 text-right">Acciones</th>
          </tr></thead>
          <tbody>
            @for(r of data(); track r.id){
              <tr class="table-row" [class.bg-blue-50]="selected()?.id===r.id">
                @for(c of columnas(); track c){<td class="p-3 align-top">{{formatValue(c, r[c])}}</td>}
                <td class="p-3 text-right whitespace-nowrap">
                  <button class="btn-soft" (click)="verDetalles(r)">Detalles</button>
                  <button class="btn-soft ml-2" (click)="editar(r)">Editar</button>
                  <button class="btn-danger ml-2" (click)="eliminar(r.id)">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr><td class="p-8 text-center text-slate-500" [attr.colspan]="columnas().length+1">No hay registros para mostrar.</td></tr>
            }
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p class="text-sm text-slate-500">Página {{page()}} · {{limit}} registros por página</p>
        <div class="flex gap-2">
          <button class="btn-soft" [disabled]="page()===1" (click)="page.set(page()-1); cargar()">Anterior</button>
          <button class="btn-soft" [disabled]="page()*limit>=total()" (click)="page.set(page()+1); cargar()">Siguiente</button>
        </div>
      </div>
    </section>
  }

  @if(tab()==='form'){
    <section class="card">
      <div class="mb-5">
        <h2 class="text-xl font-black">{{id ? 'Editar registro' : 'Nuevo registro'}}</h2>
        <p class="text-sm text-slate-500">Los campos con relación muestran datos de otros módulos para enlazar información.</p>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for(c of campos(); track c.key){
          <label class="text-sm font-bold text-slate-700">{{c.label}}
            @if(c.type==='select'){
              <select class="select mt-2" [(ngModel)]="form[c.key]">
                <option [ngValue]="''">Seleccionar...</option>
                @for(opt of options(c.ref); track opt.id ?? opt.value){
                  <option [ngValue]="opt.id ?? opt.value">{{optionLabel(c, opt)}}</option>
                }
              </select>
            } @else if(c.type==='boolean'){
              <select class="select mt-2" [(ngModel)]="form[c.key]"><option [ngValue]="true">Activo</option><option [ngValue]="false">Inactivo</option></select>
            } @else {
              <input class="input mt-2" [type]="inputType(c)" [placeholder]="c.placeholder || c.label" [(ngModel)]="form[c.key]">
            }
          </label>
        }
      </div>
      <div class="mt-6 flex flex-wrap gap-2">
        <button class="btn-primary" (click)="guardar()">Guardar</button>
        <button class="btn-soft" (click)="cancelar()">Cancelar</button>
      </div>
    </section>
  }

  @if(tab()==='detalles'){
    <section class="grid gap-5 xl:grid-cols-3">
      <div class="card xl:col-span-1">
        <h2 class="text-xl font-black">Detalle del registro</h2>
        @if(selected()){
          <div class="mt-4 space-y-3">
            @for(c of detailKeys(selected()); track c){
              <div class="rounded-2xl bg-slate-50 p-3">
                <p class="text-xs font-bold uppercase tracking-wide text-slate-400">{{label(c)}}</p>
                <p class="mt-1 break-words font-semibold text-slate-800">{{formatValue(c, selected()[c])}}</p>
              </div>
            }
          </div>
        } @else {
          <p class="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-700">Selecciona un registro desde la pestaña Listado.</p>
        }
      </div>

      <div class="card xl:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black">Relaciones del registro</h2>
            <p class="text-sm text-slate-500">Aquí se enlazan los datos cargados en otros módulos.</p>
          </div>
          <button class="btn-soft" (click)="cargarRelaciones()">Actualizar</button>
        </div>
        @if(selected()){
          <div class="grid gap-4 md:grid-cols-2">
            @for(rel of relaciones(); track rel.title){
              <div class="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div class="mb-3 flex items-center justify-between">
                  <h3 class="font-black">{{rel.icon}} {{rel.title}}</h3>
                  <span class="badge">{{rel.items.length}}</span>
                </div>
                <div class="space-y-2">
                  @for(item of rel.items; track item.id){
                    <div class="rounded-2xl bg-white p-3 text-sm shadow-sm">
                      <p class="font-bold">{{rel.primary(item)}}</p>
                      <p class="mt-1 text-slate-500">{{rel.secondary(item)}}</p>
                    </div>
                  } @empty {
                    <p class="rounded-2xl bg-white p-3 text-sm text-slate-500">Sin datos relacionados todavía.</p>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <p class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Selecciona un registro para visualizar sus conexiones.</p>
        }
      </div>
    </section>
  }
</div>
  `
})
export class CrudPageComponent {
  http = inject(HttpClient);
  route = inject(ActivatedRoute);

  q = '';
  data = signal<any[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 10;
  tab = signal<'lista' | 'form' | 'detalles'>('lista');
  form: any = {};
  id: any = null;
  selected = signal<any | null>(null);
  relaciones = signal<any[]>([]);
  catalogs = signal<Record<string, any[]>>({ estados: estadoOptions(), roles: roleOptions() });

  modulo = computed(() => this.route.snapshot.data['modulo']);
  config = computed(() => moduleConfigs[this.modulo()] || moduleConfigs['clientes']);
  campos = computed(() => this.config().fields);
  columnas = computed(() => this.config().columns);

  ngOnInit() {
    this.route.data.subscribe(() => {
      this.q = '';
      this.page.set(1);
      this.selected.set(null);
      this.relaciones.set([]);
      this.cargarCatalogos();
      this.cargar();
      this.tab.set('lista');
    });
  }

  cargar() {
    this.http.get<any>(`${API}/${this.modulo()}?q=${encodeURIComponent(this.q)}&page=${this.page()}&limit=${this.limit}`).subscribe(r => {
      this.data.set(r.data || []);
      this.total.set(r.total || 0);
      if (!this.selected() && (r.data || []).length) this.selected.set(r.data[0]);
    });
  }

  buscar() { this.page.set(1); this.cargar(); }

  nuevo() {
    this.form = {};
    this.campos().forEach(c => this.form[c.key] = c.type === 'boolean' ? true : '');
    this.id = null;
    this.tab.set('form');
  }

  editar(r: any) {
    this.id = r.id;
    this.form = { ...r };
    this.campos().forEach(c => { if (c.type === 'date' && this.form[c.key]) this.form[c.key] = String(this.form[c.key]).slice(0, 10); });
    this.tab.set('form');
  }

  cancelar() { this.tab.set('lista'); this.form = {}; this.id = null; }

  guardar() {
    const payload = { ...this.form };
    this.campos().forEach(c => {
      if (c.type === 'number' || c.type === 'select') payload[c.key] = payload[c.key] === '' ? null : Number(payload[c.key]);
      if (c.type === 'date' && payload[c.key]) payload[c.key] = new Date(payload[c.key]).toISOString();
    });
    const req = this.id ? this.http.patch(`${API}/${this.modulo()}/${this.id}`, payload) : this.http.post(`${API}/${this.modulo()}`, payload);
    req.subscribe(() => { this.cancelar(); this.cargar(); this.cargarCatalogos(); });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar registro?')) this.http.delete(`${API}/${this.modulo()}/${id}`).subscribe(() => {
      if (this.selected()?.id === id) this.selected.set(null);
      this.cargar();
    });
  }

  verDetalles(r: any) {
    this.selected.set(r);
    this.tab.set('detalles');
    this.cargarRelaciones();
  }

  cargarCatalogos() {
    const refs = Array.from(new Set(this.campos().filter(c => c.ref && !['estados', 'roles'].includes(c.ref)).map(c => c.ref!)));
    ['clientes', 'sucursales', 'encomiendas', 'envios', 'pagos'].forEach(x => { if (!refs.includes(x)) refs.push(x); });
    refs.forEach(ref => {
      this.http.get<any>(`${API}/${ref}?page=1&limit=100`).subscribe({
        next: r => this.catalogs.update(c => ({ ...c, [ref]: r.data || [] })),
        error: () => this.catalogs.update(c => ({ ...c, [ref]: [] }))
      });
    });
  }

  cargarRelaciones() {
    const row = this.selected();
    if (!row) return;
    const c = this.catalogs();
    const clientes = c['clientes'] || [], encomiendas = c['encomiendas'] || [], envios = c['envios'] || [], pagos = c['pagos'] || [], facturas = c['facturas'] || [], sucursales = c['sucursales'] || [], seguimientos = c['seguimientos'] || [];

    const ensure = ['facturas', 'seguimientos'];
    ensure.forEach(ref => this.http.get<any>(`${API}/${ref}?page=1&limit=100`).subscribe({ next: r => this.catalogs.update(cat => ({ ...cat, [ref]: r.data || [] })) }));

    const rels: any[] = [];
    const mod = this.modulo();

    if (mod === 'clientes') {
      const enc = encomiendas.filter((e: any) => Number(e.remitenteId) === Number(row.id) || Number(e.destinatarioId) === Number(row.id));
      rels.push(rel('📦', 'Encomiendas del cliente', enc, e => `${e.codigo} - ${e.descripcion || 'Sin descripción'}`, e => `${Number(e.remitenteId) === Number(row.id) ? 'Remitente' : 'Destinatario'} · Valor Bs ${e.valorDeclarado || 0}`));
      const env = envios.filter((v: any) => enc.some((e: any) => Number(e.id) === Number(v.encomiendaId)));
      rels.push(rel('🚚', 'Envíos vinculados', env, e => `Envío #${e.id} · Costo Bs ${e.costo || 0}`, e => `Origen ${nameById(sucursales, e.sucursalOrigenId, sucursalDisplay)} → Destino ${nameById(sucursales, e.sucursalDestinoId, sucursalDisplay)}`));
    } else if (mod === 'encomiendas') {
      rels.push(rel('👤', 'Clientes relacionados', [findById(clientes, row.remitenteId), findById(clientes, row.destinatarioId)].filter(Boolean), e => clienteDisplay(e), e => `CI ${e.ci || 'N/A'} · ${e.telefono || 'Sin teléfono'}`));
      rels.push(rel('🚚', 'Envío de esta encomienda', envios.filter((e: any) => Number(e.encomiendaId) === Number(row.id)), e => `Envío #${e.id}`, e => `Costo Bs ${e.costo || 0} · Estado ${estadoName(e.estadoId)}`));
    } else if (mod === 'envios') {
      rels.push(rel('📦', 'Encomienda', [findById(encomiendas, row.encomiendaId)].filter(Boolean), e => `${e.codigo} - ${e.descripcion}`, e => `Remitente: ${nameById(clientes, e.remitenteId, clienteDisplay)} · Destinatario: ${nameById(clientes, e.destinatarioId, clienteDisplay)}`));
      rels.push(rel('📍', 'Seguimiento', seguimientos.filter((s: any) => Number(s.envioId) === Number(row.id)), e => `${estadoName(e.estadoId)} - ${e.ubicacion || 'Sin ubicación'}`, e => e.observaciones || 'Sin observaciones'));
      rels.push(rel('💳', 'Pagos', pagos.filter((p: any) => Number(p.envioId) === Number(row.id)), e => `Pago #${e.id} · Bs ${e.monto || 0}`, e => `${e.metodo || 'Sin método'} · ${formatDate(e.fecha)}`));
    } else if (mod === 'pagos') {
      rels.push(rel('🚚', 'Envío pagado', [findById(envios, row.envioId)].filter(Boolean), e => `Envío #${e.id}`, e => `Costo Bs ${e.costo || 0}`));
      rels.push(rel('🧾', 'Factura', facturas.filter((f: any) => Number(f.pagoId) === Number(row.id)), e => e.numeroFactura || `Factura #${e.id}`, e => `${e.razonSocial || 'Sin razón social'} · NIT ${e.nit || 'N/A'}`));
    } else if (mod === 'facturas') {
      const pago = findById(pagos, row.pagoId);
      rels.push(rel('💳', 'Pago relacionado', [pago].filter(Boolean), e => `Pago #${e.id} · Bs ${e.monto || 0}`, e => e.metodo || 'Sin método'));
      const envio = pago ? findById(envios, pago.envioId) : null;
      rels.push(rel('🚚', 'Envío relacionado', [envio].filter(Boolean), e => `Envío #${e.id}`, e => `Encomienda ${e.encomiendaId}`));
    } else if (mod === 'sucursales') {
      rels.push(rel('🚚', 'Envíos desde/hacia esta sucursal', envios.filter((e: any) => Number(e.sucursalOrigenId) === Number(row.id) || Number(e.sucursalDestinoId) === Number(row.id)), e => `Envío #${e.id}`, e => `${Number(e.sucursalOrigenId) === Number(row.id) ? 'Origen' : 'Destino'} · Costo Bs ${e.costo || 0}`));
    } else if (mod === 'seguimientos') {
      const envio = findById(envios, row.envioId);
      rels.push(rel('🚚', 'Envío relacionado', [envio].filter(Boolean), e => `Envío #${e.id}`, e => `Estado ${estadoName(e.estadoId)} · Costo Bs ${e.costo || 0}`));
    } else {
      rels.push(rel('🔐', 'Permisos del usuario', [{ id: row.id, rol: row.rol, estado: row.estado }], e => `Rol: ${e.rol || 'Sin rol'}`, e => e.estado ? 'Usuario activo' : 'Usuario inactivo'));
    }
    this.relaciones.set(rels);
  }

  options(ref?: string) { return ref ? (this.catalogs()[ref] || []) : []; }
  optionLabel(c: FieldConfig, opt: any) { return c.display ? c.display(opt) : (opt.label || opt.nombre || opt.codigo || opt.nombreUsuario || `#${opt.id}`); }
  inputType(c: FieldConfig) { return c.type === 'number' ? 'number' : c.type === 'date' ? 'date' : 'text'; }
  detailKeys(row: any) { return Object.keys(row || {}).filter(k => typeof row[k] !== 'object'); }
  label(key: string) { return this.campos().find(c => c.key === key)?.label || labels[key] || key; }
  formatValue(key: string, value: any) {
    if (value === null || value === undefined || value === '') return '—';
    if (key.toLowerCase().includes('fecha')) return formatDate(value);
    if (key === 'estadoId') return estadoName(value);
    if (key.endsWith('Id')) {
      const base = key.replace('Id', '');
      if (base.includes('remitente') || base.includes('destinatario')) return nameById(this.catalogs()['clientes'] || [], value, clienteDisplay);
      if (base.includes('sucursalOrigen') || base.includes('sucursalDestino')) return nameById(this.catalogs()['sucursales'] || [], value, sucursalDisplay);
      if (base.includes('encomienda')) return nameById(this.catalogs()['encomiendas'] || [], value, encomiendaDisplay);
      if (base.includes('envio')) return nameById(this.catalogs()['envios'] || [], value, envioDisplay);
      if (base.includes('pago')) return nameById(this.catalogs()['pagos'] || [], value, pagoDisplay);
    }
    if (typeof value === 'boolean') return value ? 'Activo' : 'Inactivo';
    return value;
  }
}

const labels: Record<string, string> = {
  id: 'ID', ci: 'CI', email: 'Email', fechaRegistro: 'Fecha registro', remitenteId: 'Remitente', destinatarioId: 'Destinatario', valorDeclarado: 'Valor declarado',
  encomiendaId: 'Encomienda', sucursalOrigenId: 'Sucursal origen', sucursalDestinoId: 'Sucursal destino', fechaEnvio: 'Fecha envío', fechaEstimada: 'Fecha estimada', estadoId: 'Estado',
  envioId: 'Envío', pagoId: 'Pago', numeroFactura: 'N° factura', razonSocial: 'Razón social', nombreUsuario: 'Usuario'
};
function estadoOptions() { return [{ value: 1, label: 'Registrado' }, { value: 2, label: 'En tránsito' }, { value: 3, label: 'Entregado' }]; }
function roleOptions() { return [{ value: 'admin', label: 'Administrador' }, { value: 'operador', label: 'Operador' }]; }
function estadoName(id: any) { return estadoOptions().find(e => Number(e.value) === Number(id))?.label || `Estado ${id}`; }
function formatDate(v: any) { if (!v) return '—'; const d = new Date(v); return isNaN(d.getTime()) ? v : d.toLocaleDateString(); }
function findById(arr: any[], id: any) { return arr.find(x => Number(x.id) === Number(id)); }
function nameById(arr: any[], id: any, display: (x: any) => string) { const item = findById(arr, id); return item ? display(item) : `#${id}`; }
function rel(icon: string, title: string, items: any[], primary: (x: any) => string, secondary: (x: any) => string) { return { icon, title, items: items || [], primary, secondary }; }
