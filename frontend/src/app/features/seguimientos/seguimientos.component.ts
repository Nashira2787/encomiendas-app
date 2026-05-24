import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-seguimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguimientos.component.html',
  styleUrls: ['./seguimientos.component.css']
})
export class SeguimientosComponent implements OnInit {
  seguimientos: any[] = [];
  envios: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  seguimientoIdEditando: number | null = null;

  seguimiento = {
    envioId: '',
    estadoId: 1,
    ubicacion: '',
    observaciones: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.obtenerSeguimientos();

    this.api.get('envios?q=ENC&page=1&limit=1000').subscribe({
      next: (res: any) => this.envios = res.data || [],
      error: err => console.error('Error al listar envíos:', err)
    });
  }

  obtenerSeguimientos() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `seguimientos?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `seguimientos?q=En&page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.seguimientos = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar seguimientos:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerSeguimientos();
  }

  guardarSeguimiento() {
    const data = {
      envioId: Number(this.seguimiento.envioId),
      estadoId: Number(this.seguimiento.estadoId),
      ubicacion: this.seguimiento.ubicacion,
      observaciones: this.seguimiento.observaciones
    };

    if (this.editando && this.seguimientoIdEditando) {
      this.api.patch('seguimientos', this.seguimientoIdEditando, data).subscribe({
        next: () => {
          alert('Seguimiento actualizado correctamente');
          this.limpiarFormulario();
          this.cargarDatos();
        },
        error: err => {
          console.error('Error al actualizar seguimiento:', err);
          alert('Error al actualizar seguimiento');
        }
      });

      return;
    }

    this.api.post('seguimientos', data).subscribe({
      next: () => {
        alert('Seguimiento guardado correctamente');
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar seguimiento:', err);
        alert('Error al guardar seguimiento');
      }
    });
  }

  editarSeguimiento(s: any) {
    this.editando = true;
    this.seguimientoIdEditando = s.id;

    this.seguimiento = {
      envioId: s.envioId ? String(s.envioId) : '',
      estadoId: Number(s.estadoId) || 1,
      ubicacion: s.ubicacion || '',
      observaciones: s.observaciones || ''
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.seguimientoIdEditando = null;

    this.seguimiento = {
      envioId: '',
      estadoId: 1,
      ubicacion: '',
      observaciones: ''
    };
  }

  eliminarSeguimiento(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar este seguimiento?');

    if (!confirmar) return;

    this.api.delete('seguimientos', id).subscribe({
      next: () => this.obtenerSeguimientos(),
      error: err => console.error('Error al eliminar seguimiento:', err)
    });
  }

  obtenerEstado(id: number): string {
    if (Number(id) === 1) return 'Pendiente';
    if (Number(id) === 2) return 'En tránsito';
    if (Number(id) === 3) return 'Entregado';
    return 'Sin estado';
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerSeguimientos();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerSeguimientos();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}