import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  pagos: any[] = [];
  envios: any[] = [];

  pago = {
    envioId: '',
    monto: 0,
    metodo: 'EFECTIVO'
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.obtenerPagos();

    this.api.get('envios?q=').subscribe({
      next: (res: any) => this.envios = res.data || [],
      error: err => console.error('Error al listar envíos:', err)
    });
  }

  obtenerPagos() {
    this.api.get('pagos?q=').subscribe({
      next: (res: any) => {
        this.pagos = res.data || [];
      },
      error: err => console.error('Error al listar pagos:', err)
    });
  }

  guardarPago() {
    const data = {
      envioId: Number(this.pago.envioId),
      monto: Number(this.pago.monto),
      metodo: this.pago.metodo
    };

    this.api.post('pagos', data).subscribe({
      next: () => {
        alert('Pago guardado correctamente');

        this.pago = {
          envioId: '',
          monto: 0,
          metodo: 'EFECTIVO'
        };

        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar pago:', err);
        alert('Error al guardar pago');
      }
    });
  }

  eliminarPago(id: number) {
    this.api.delete('pagos', id).subscribe({
      next: () => this.obtenerPagos(),
      error: err => console.error('Error al eliminar pago:', err)
    });
  }

  obtenerEstadoPago(metodo: string): string {
    if (!metodo) return 'Sin método';
    return metodo;
  }
}