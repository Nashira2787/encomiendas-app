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

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  pagoIdEditando: number | null = null;

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

    this.api.get('envios?q=ENC&page=1&limit=1000').subscribe({
      next: (res: any) => this.envios = res.data || [],
      error: err => console.error('Error al listar envíos:', err)
    });
  }

  obtenerPagos() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `pagos?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `pagos?page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.pagos = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar pagos:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerPagos();
  }

  cargarMontoDesdeEnvio() {
    const envio = this.envios.find(e => Number(e.id) === Number(this.pago.envioId));

    if (envio) {
      this.pago.monto = Number(envio.costo) || 0;
    }
  }

  guardarPago() {
    const data = {
      envioId: Number(this.pago.envioId),
      monto: Number(this.pago.monto),
      metodo: this.pago.metodo
    };

    if (this.editando && this.pagoIdEditando) {
      this.api.patch('pagos', this.pagoIdEditando, data).subscribe({
        next: () => {
          alert('Pago actualizado correctamente');
          this.limpiarFormulario();
          this.cargarDatos();
        },
        error: err => {
          console.error('Error al actualizar pago:', err);
          alert('Error al actualizar pago');
        }
      });

      return;
    }

    this.api.post('pagos', data).subscribe({
      next: () => {
        alert('Pago guardado correctamente');
        this.limpiarFormulario();
        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar pago:', err);
        alert('Error al guardar pago');
      }
    });
  }

  editarPago(p: any) {
    this.editando = true;
    this.pagoIdEditando = p.id;

    this.pago = {
      envioId: p.envioId ? String(p.envioId) : '',
      monto: Number(p.monto) || 0,
      metodo: p.metodo || 'EFECTIVO'
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.pagoIdEditando = null;

    this.pago = {
      envioId: '',
      monto: 0,
      metodo: 'EFECTIVO'
    };
  }

  eliminarPago(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar este pago?');

    if (!confirmar) return;

    this.api.delete('pagos', id).subscribe({
      next: () => this.obtenerPagos(),
      error: err => console.error('Error al eliminar pago:', err)
    });
  }

  buscarEnvioTexto(id: number): string {
    const envio = this.envios.find(e => Number(e.id) === Number(id));
    return envio
      ? `Envío #${envio.id} - ${envio.encomienda || ''} - ${envio.costo} Bs`
      : `#${id}`;
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerPagos();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerPagos();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}