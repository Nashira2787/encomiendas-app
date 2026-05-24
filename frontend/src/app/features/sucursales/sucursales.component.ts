import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent implements OnInit {
  sucursales: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  sucursalIdEditando: number | null = null;

  sucursal = {
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.obtenerSucursales();
  }

  obtenerSucursales() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `sucursales?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `sucursales?q=a&page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.sucursales = res.data || [];
        this.total = res.total || 0;
      },
      error: (err) => console.error('Error al listar sucursales:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerSucursales();
  }

  guardarSucursal() {
    if (this.editando && this.sucursalIdEditando) {
      this.api.patch('sucursales', this.sucursalIdEditando, this.sucursal).subscribe({
        next: () => {
          alert('Sucursal actualizada correctamente');
          this.limpiarFormulario();
          this.obtenerSucursales();
        },
        error: (err) => {
          console.error('Error al actualizar sucursal:', err);
          alert('Error al actualizar sucursal');
        }
      });

      return;
    }

    this.api.post('sucursales', this.sucursal).subscribe({
      next: () => {
        alert('Sucursal guardada correctamente');
        this.limpiarFormulario();
        this.obtenerSucursales();
      },
      error: (err) => {
        console.error('Error al guardar sucursal:', err);
        alert('Error al guardar sucursal');
      }
    });
  }

  editarSucursal(s: any) {
    this.editando = true;
    this.sucursalIdEditando = s.id;

    this.sucursal = {
      nombre: s.nombre || '',
      direccion: s.direccion || '',
      ciudad: s.ciudad || '',
      telefono: s.telefono || ''
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.sucursalIdEditando = null;

    this.sucursal = {
      nombre: '',
      direccion: '',
      ciudad: '',
      telefono: ''
    };
  }

  eliminarSucursal(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar esta sucursal?');

    if (!confirmar) return;

    this.api.delete('sucursales', id).subscribe({
      next: () => this.obtenerSucursales(),
      error: (err) => console.error('Error al eliminar sucursal:', err)
    });
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerSucursales();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerSucursales();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}