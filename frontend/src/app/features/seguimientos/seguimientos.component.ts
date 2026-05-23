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

    this.api.get('envios?q=').subscribe({
      next: (res: any) => this.envios = res.data || [],
      error: err => console.error('Error al listar envíos:', err)
    });
  }

  obtenerSeguimientos() {
    this.api.get('seguimientos?q=').subscribe({
      next: (res: any) => this.seguimientos = res.data || [],
      error: err => console.error('Error al listar seguimientos:', err)
    });
  }

  guardarSeguimiento() {
    const data = {
      envioId: Number(this.seguimiento.envioId),
      estadoId: Number(this.seguimiento.estadoId),
      ubicacion: this.seguimiento.ubicacion,
      observaciones: this.seguimiento.observaciones
    };

    this.api.post('seguimientos', data).subscribe({
      next: () => {
        alert('Seguimiento guardado correctamente');

        this.seguimiento = {
          envioId: '',
          estadoId: 1,
          ubicacion: '',
          observaciones: ''
        };

        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar seguimiento:', err);
        alert('Error al guardar seguimiento');
      }
    });
  }

  eliminarSeguimiento(id: number) {
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
}