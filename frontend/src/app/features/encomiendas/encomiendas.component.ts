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
    this.api.get('clientes?q=').subscribe({
      next: (res: any) => this.clientes = res.data || [],
      error: err => console.error('Error al listar clientes:', err)
    });
  }

  obtenerEncomiendas() {
    this.api.get('encomiendas?q=').subscribe({
      next: (res: any) => {
        this.encomiendas = res.data || [];
      },
      error: err => console.error('Error al listar encomiendas:', err)
    });
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

    this.api.post('encomiendas', data).subscribe({
      next: () => {
        alert('Encomienda guardada correctamente');

        this.encomienda = {
          codigo: '',
          remitenteId: '',
          destinatarioId: '',
          descripcion: '',
          peso: 0,
          volumen: 0,
          valorDeclarado: 0
        };

        this.cargarDatos();
      },
      error: err => {
        console.error('Error al guardar encomienda:', err);
        alert('Error al guardar encomienda');
      }
    });
  }

  eliminarEncomienda(id: number) {
    this.api.delete('encomiendas', id).subscribe({
      next: () => this.obtenerEncomiendas(),
      error: err => console.error('Error al eliminar encomienda:', err)
    });
  }
}