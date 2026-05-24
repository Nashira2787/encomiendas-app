import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  facturas: any[] = [];
  pagos: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  facturaIdEditando: number | null = null;

  factura = {
    pagoId: '',
    numeroFactura: '',
    nit: '',
    razonSocial: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.obtenerFacturas();

    this.api.get('pagos?page=1&limit=1000').subscribe({
      next: (res: any) => this.pagos = res.data || [],
      error: err => console.error('Error al listar pagos:', err)
    });
  }

  obtenerFacturas() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `facturas?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `facturas?page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.facturas = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar facturas:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerFacturas();
  }

  guardarFactura() {
    const data = {
      pagoId: Number(this.factura.pagoId),
      numeroFactura: this.factura.numeroFactura,
      nit: this.factura.nit,
      razonSocial: this.factura.razonSocial
    };

    if (this.editando && this.facturaIdEditando) {
      this.api.patch('facturas', this.facturaIdEditando, data).subscribe({
        next: () => {
          alert('Factura actualizada correctamente');
          this.limpiarFormulario();
          this.cargarDatos();
        },
        error: err => {
          console.error('Error al actualizar factura:', err);
          alert('Error al actualizar factura');
        }
      });

      return;
    }

    this.api.post('facturas', data).subscribe({
      next: () => {
        alert('Factura guardada correctamente');
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar factura:', err);
        alert('Error al guardar factura');
      }
    });
  }

  editarFactura(f: any) {
    this.editando = true;
    this.facturaIdEditando = f.id;

    this.factura = {
      pagoId: f.pagoId ? String(f.pagoId) : '',
      numeroFactura: f.numeroFactura || '',
      nit: f.nit || '',
      razonSocial: f.razonSocial || ''
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.facturaIdEditando = null;

    this.factura = {
      pagoId: '',
      numeroFactura: '',
      nit: '',
      razonSocial: ''
    };
  }

  eliminarFactura(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar esta factura?');

    if (!confirmar) return;

    this.api.delete('facturas', id).subscribe({
      next: () => this.obtenerFacturas(),
      error: err => console.error('Error al eliminar factura:', err)
    });
  }

  buscarPagoTexto(id: number): string {
    const pago = this.pagos.find(p => Number(p.id) === Number(id));
    return pago ? `Pago #${pago.id} - ${pago.monto} Bs` : `#${id}`;
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerFacturas();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerFacturas();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}