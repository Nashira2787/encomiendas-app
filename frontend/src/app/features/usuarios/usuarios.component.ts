import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios:any[]=[];

  usuario = {
    nombreUsuario:'',
    password:'',
    rol:'USUARIO',
    estado:true
  };

  constructor(private api:ApiService){}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.api.get('usuarios?q=').subscribe({
      next:(res:any)=>{
        this.usuarios = res.data || [];
      },
      error:(err)=>console.error(err)
    });
  }

  guardarUsuario() {

    this.api.post('usuarios',this.usuario).subscribe({
      next:()=>{

        alert('Usuario guardado');

        this.usuario = {
          nombreUsuario:'',
          password:'',
          rol:'USUARIO',
          estado:true
        };

        this.obtenerUsuarios();

      },
      error:(err)=>{
        console.error(err);
        alert('Error al guardar usuario');
      }
    });

  }

  eliminarUsuario(id:number){
    this.api.delete('usuarios',id).subscribe({
      next:()=>this.obtenerUsuarios()
    });
  }

}