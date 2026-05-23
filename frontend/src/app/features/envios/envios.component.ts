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

    this.api.get('encomiendas?q=').subscribe({
      next: (res: any) => this.encomiendas = res.data || [],
      error: err => console.error('Error al listar encomiendas:', err)
    });

    this.api.get('sucursales?q=').subscribe({
      next: (res: any) => this.sucursales = res.data || [],
      error: err => console.error('Error al listar sucursales:', err)
    });
  }

  obtenerEnvios() {
    this.api.get('envios?q=').subscribe({
      next: (res: any) => this.envios = res.data || [],
      error: err => console.error('Error al listar envíos:', err)
    });
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

    this.api.post('envios', data).subscribe({
      next: () => {
        alert('Envío guardado correctamente');

        this.envio = {
          encomiendaId: '',
          sucursalOrigenId: '',
          sucursalDestinoId: '',
          fechaEnvio: '',
          fechaEstimada: '',
          costo: 0,
          estadoId: 1
        };

        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar envío:', err);
        alert('Error al guardar envío');
      }
    });
  }

  eliminarEnvio(id: number) {
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
}