import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-envios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.css']
})
export class EnviosComponent implements OnInit {
  envios: any[] = [];
  encomiendas: any[] = [];
  sucursales: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  envioIdEditando: number | null = null;

  envio = {
    encomiendaId: '',
    sucursalOrigenId: '',
    sucursalDestinoId: '',
    fechaEnvio: '',
    fechaEstimada: '',
    costo: 0,
    estadoId: 1
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.obtenerEnvios();

    this.api.get('encomiendas?q=ENC&page=1&limit=1000').subscribe({
      next: (res: any) => this.encomiendas = res.data || [],
      error: err => console.error('Error al listar encomiendas:', err)
    });

    this.api.get('sucursales?q=a&page=1&limit=1000').subscribe({
      next: (res: any) => this.sucursales = res.data || [],
      error: err => console.error('Error al listar sucursales:', err)
    });
  }

  obtenerEnvios() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `envios?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `envios?q=ENC&page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.envios = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar envíos:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerEnvios();
  }

  guardarEnvio() {
    const data = {
      encomiendaId: Number(this.envio.encomiendaId),
      sucursalOrigenId: Number(this.envio.sucursalOrigenId),
      sucursalDestinoId: Number(this.envio.sucursalDestinoId),
      fechaEnvio: this.envio.fechaEnvio || null,
      fechaEstimada: this.envio.fechaEstimada || null,
      costo: Number(this.envio.costo),
      estadoId: Number(this.envio.estadoId)
    };

    if (this.editando && this.envioIdEditando) {
      this.api.patch('envios', this.envioIdEditando, data).subscribe({
        next: () => {
          alert('Envío actualizado correctamente');
          this.limpiarFormulario();
          this.cargarDatos();
        },
        error: err => {
          console.error('Error al actualizar envío:', err);
          alert('Error al actualizar envío');
        }
      });

      return;
    }

    this.api.post('envios', data).subscribe({
      next: () => {
        alert('Envío guardado correctamente');
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar envío:', err);
        alert('Error al guardar envío');
      }
    });
  }

  editarEnvio(e: any) {
    this.editando = true;
    this.envioIdEditando = e.id;

    this.envio = {
      encomiendaId: e.encomiendaId ? String(e.encomiendaId) : '',
      sucursalOrigenId: e.sucursalOrigenId ? String(e.sucursalOrigenId) : '',
      sucursalDestinoId: e.sucursalDestinoId ? String(e.sucursalDestinoId) : '',
      fechaEnvio: this.formatearFechaInput(e.fechaEnvio),
      fechaEstimada: this.formatearFechaInput(e.fechaEstimada),
      costo: Number(e.costo) || 0,
      estadoId: Number(e.estadoId) || 1
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.envioIdEditando = null;

    this.envio = {
      encomiendaId: '',
      sucursalOrigenId: '',
      sucursalDestinoId: '',
      fechaEnvio: '',
      fechaEstimada: '',
      costo: 0,
      estadoId: 1
    };
  }

  eliminarEnvio(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar este envío?');

    if (!confirmar) return;

    this.api.delete('envios', id).subscribe({
      next: () => this.obtenerEnvios(),
      error: err => console.error('Error al eliminar envío:', err)
    });
  }

  obtenerCodigoEncomienda(id: number): string {
    const encomienda = this.encomiendas.find(e => Number(e.id) === Number(id));
    return encomienda ? encomienda.codigo : 'Sin código';
  }

  obtenerNombreSucursal(id: number): string {
    const sucursal = this.sucursales.find(s => Number(s.id) === Number(id));
    return sucursal ? sucursal.nombre : 'Sin sucursal';
  }

  obtenerEstado(id: number): string {
    if (Number(id) === 1) return 'Pendiente';
    if (Number(id) === 2) return 'En tránsito';
    if (Number(id) === 3) return 'Entregado';
    return 'Sin estado';
  }

  formatearFechaInput(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().slice(0, 16);
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerEnvios();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerEnvios();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}