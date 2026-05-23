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

  facturas:any[] = [];
  pagos:any[] = [];

  factura = {
    pagoId:'',
    numeroFactura:'',
    nit:'',
    razonSocial:''
  };

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {

    this.obtenerFacturas();

    this.api.get('pagos?q=').subscribe({
      next:(res:any)=>this.pagos = res.data || [],
      error:(err)=>console.error(err)
    });

  }

  obtenerFacturas() {
    this.api.get('facturas?q=').subscribe({
      next:(res:any)=>{
        this.facturas = res.data || [];
      }
    });
  }

  guardarFactura() {

    const data = {
      pagoId:Number(this.factura.pagoId),
      numeroFactura:this.factura.numeroFactura,
      nit:this.factura.nit,
      razonSocial:this.factura.razonSocial
    };

    this.api.post('facturas',data).subscribe({
      next:()=>{
        alert('Factura guardada');

        this.factura = {
          pagoId:'',
          numeroFactura:'',
          nit:'',
          razonSocial:''
        };

        this.cargarDatos();
      },
      error:(err)=>{
        console.error(err);
        alert('Error al guardar factura');
      }
    });

  }

  eliminarFactura(id:number){
    this.api.delete('facturas',id).subscribe({
      next:()=>this.obtenerFacturas()
    });
  }

}