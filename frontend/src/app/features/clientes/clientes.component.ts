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
    this.api.get('clientes?q=').subscribe({
      next: (res: any) => {
        this.clientes = res.data || [];
      },
      error: (err) => {
        console.error('Error al listar clientes:', err);
      }
    });
  }

  obtenerEncomiendas() {
    this.api.get('encomiendas?q=').subscribe({
      next: (res: any) => {
        this.encomiendas = res.data || [];
      },
      error: (err) => {
        console.error('Error al listar encomiendas:', err);
      }
    });
  }

  guardarCliente() {
    this.api.post('clientes', this.cliente).subscribe({
      next: () => {
        alert('Cliente guardado correctamente');

        this.cliente = {
          nombre: '',
          apellido: '',
          ci: '',
          telefono: '',
          email: '',
          direccion: ''
        };

        this.obtenerClientes();
      },
      error: (err) => {
        console.error('Error al guardar cliente:', err);
        alert('Error al guardar cliente');
      }
    });
  }

  eliminarCliente(id: number) {
    this.api.delete('clientes', id).subscribe({
      next: () => {
        this.obtenerClientes();

        if (this.clienteSeleccionado?.id === id) {
          this.clienteSeleccionado = null;
          this.encomiendasCliente = [];
        }
      },
      error: (err) => console.error('Error al eliminar cliente:', err)
    });
  }

  verDetalles(cliente: any) {
    this.clienteSeleccionado = cliente;

    this.encomiendasCliente = this.encomiendas.filter(e =>
      Number(e.remitenteId) === Number(cliente.id) ||
      Number(e.destinatarioId) === Number(cliente.id)
    );
  }
}