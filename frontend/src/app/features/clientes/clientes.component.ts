import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  encomiendas: any[] = [];

  clienteSeleccionado: any = null;
  encomiendasCliente: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  clienteIdEditando: number | null = null;

  cliente = {
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    email: '',
    direccion: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerEncomiendas();
  }

  obtenerClientes() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `clientes?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `clientes?q=a&page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.clientes = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar clientes:', err)
    });
  }

  obtenerEncomiendas() {
    this.api.get('encomiendas?q=a&page=1&limit=1000').subscribe({
      next: (res: any) => this.encomiendas = res.data || [],
      error: err => console.error('Error al listar encomiendas:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerClientes();
  }

  guardarCliente() {
    if (this.editando && this.clienteIdEditando) {
      this.api.patch('clientes', this.clienteIdEditando, this.cliente).subscribe({
        next: () => {
          alert('Cliente actualizado correctamente');
          this.limpiarFormulario();
          this.obtenerClientes();
        },
        error: err => {
          console.error('Error al actualizar cliente:', err);
          alert('Error al actualizar cliente');
        }
      });

      return;
    }

    this.api.post('clientes', this.cliente).subscribe({
      next: () => {
        alert('Cliente guardado correctamente');
        this.limpiarFormulario();
        this.obtenerClientes();
      },
      error: err => {
        console.error('Error al guardar cliente:', err);
        alert('Error al guardar cliente');
      }
    });
  }

  editarCliente(c: any) {
    this.editando = true;
    this.clienteIdEditando = c.id;

    this.cliente = {
      nombre: c.nombre || '',
      apellido: c.apellido || '',
      ci: c.ci || '',
      telefono: c.telefono || '',
      email: c.email || '',
      direccion: c.direccion || ''
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.clienteIdEditando = null;

    this.cliente = {
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      email: '',
      direccion: ''
    };
  }

  eliminarCliente(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar este cliente?');

    if (!confirmar) return;

    this.api.delete('clientes', id).subscribe({
      next: () => {
        this.obtenerClientes();

        if (this.clienteSeleccionado?.id === id) {
          this.clienteSeleccionado = null;
          this.encomiendasCliente = [];
        }
      },
      error: err => console.error('Error al eliminar cliente:', err)
    });
  }

  verDetalles(cliente: any) {
    this.clienteSeleccionado = cliente;

    this.encomiendasCliente = this.encomiendas.filter(e =>
      Number(e.remitenteId) === Number(cliente.id) ||
      Number(e.destinatarioId) === Number(cliente.id)
    );
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerClientes();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerClientes();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}