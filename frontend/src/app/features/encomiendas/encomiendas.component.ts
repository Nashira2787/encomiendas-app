import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-encomiendas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encomiendas.component.html',
  styleUrls: ['./encomiendas.component.css']
})
export class EncomiendasComponent implements OnInit {
  encomiendas: any[] = [];
  clientes: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  encomiendaIdEditando: number | null = null;

  encomienda = {
    codigo: '',
    remitenteId: '',
    destinatarioId: '',
    descripcion: '',
    peso: 0,
    volumen: 0,
    valorDeclarado: 0
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.obtenerEncomiendas();

    this.api.get('clientes?q=a&page=1&limit=1000').subscribe({
      next: (res: any) => this.clientes = res.data || [],
      error: err => console.error('Error al listar clientes:', err)
    });
  }

  obtenerEncomiendas() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `encomiendas?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `encomiendas?q=ENC&page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.encomiendas = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar encomiendas:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerEncomiendas();
  }

  guardarEncomienda() {
    const data = {
      codigo: this.encomienda.codigo,
      remitenteId: Number(this.encomienda.remitenteId),
      destinatarioId: Number(this.encomienda.destinatarioId),
      descripcion: this.encomienda.descripcion,
      peso: Number(this.encomienda.peso),
      volumen: Number(this.encomienda.volumen),
      valorDeclarado: Number(this.encomienda.valorDeclarado)
    };

    if (this.editando && this.encomiendaIdEditando) {
      this.api.patch('encomiendas', this.encomiendaIdEditando, data).subscribe({
        next: () => {
          alert('Encomienda actualizada correctamente');
          this.limpiarFormulario();
          this.cargarDatos();
        },
        error: err => {
          console.error('Error al actualizar encomienda:', err);
          alert('Error al actualizar encomienda');
        }
      });

      return;
    }

    this.api.post('encomiendas', data).subscribe({
      next: () => {
        alert('Encomienda guardada correctamente');
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar encomienda:', err);
        alert('Error al guardar encomienda');
      }
    });
  }

  editarEncomienda(e: any) {
    this.editando = true;
    this.encomiendaIdEditando = e.id;

    this.encomienda = {
      codigo: e.codigo || '',
      remitenteId: e.remitenteId ? String(e.remitenteId) : '',
      destinatarioId: e.destinatarioId ? String(e.destinatarioId) : '',
      descripcion: e.descripcion || '',
      peso: Number(e.peso) || 0,
      volumen: Number(e.volumen) || 0,
      valorDeclarado: Number(e.valorDeclarado) || 0
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.encomiendaIdEditando = null;

    this.encomienda = {
      codigo: '',
      remitenteId: '',
      destinatarioId: '',
      descripcion: '',
      peso: 0,
      volumen: 0,
      valorDeclarado: 0
    };
  }

  eliminarEncomienda(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar esta encomienda?');

    if (!confirmar) return;

    this.api.delete('encomiendas', id).subscribe({
      next: () => this.obtenerEncomiendas(),
      error: err => console.error('Error al eliminar encomienda:', err)
    });
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerEncomiendas();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerEncomiendas();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}