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
    this.api.get('sucursales?q=').subscribe({
      next: (res: any) => {
        this.sucursales = res.data || [];
      },
      error: (err) => console.error('Error al listar sucursales:', err)
    });
  }

  guardarSucursal() {
    this.api.post('sucursales', this.sucursal).subscribe({
      next: () => {
        alert('Sucursal guardada correctamente');
        this.sucursal = {
          nombre: '',
          direccion: '',
          ciudad: '',
          telefono: ''
        };
        this.obtenerSucursales();
      },
      error: (err) => {
        console.error('Error al guardar sucursal:', err);
        alert('Error al guardar sucursal');
      }
    });
  }

  eliminarSucursal(id: number) {
    this.api.delete('sucursales', id).subscribe({
      next: () => this.obtenerSucursales(),
      error: (err) => console.error('Error al eliminar sucursal:', err)
    });
  }
}