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
  usuarios: any[] = [];

  busqueda = '';
  pagina = 1;
  limite = 10;
  total = 0;

  editando = false;
  usuarioIdEditando: number | null = null;

  usuario = {
    nombreUsuario: '',
    password: '',
    rol: 'USUARIO',
    estado: true
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    const filtro = this.busqueda.trim();

    const endpoint = filtro
      ? `usuarios?q=${encodeURIComponent(filtro)}&page=${this.pagina}&limit=${this.limite}`
      : `usuarios?q=a&page=${this.pagina}&limit=${this.limite}`;

    this.api.get(endpoint).subscribe({
      next: (res: any) => {
        this.usuarios = res.data || [];
        this.total = res.total || 0;
      },
      error: err => console.error('Error al listar usuarios:', err)
    });
  }

  buscar() {
    this.pagina = 1;
    this.obtenerUsuarios();
  }

  guardarUsuario() {
    const data: any = {
      nombreUsuario: this.usuario.nombreUsuario,
      rol: this.usuario.rol,
      estado: this.usuario.estado
    };

    if (this.usuario.password) {
      data.password = this.usuario.password;
    }

    if (this.editando && this.usuarioIdEditando) {
      this.api.patch('usuarios', this.usuarioIdEditando, data).subscribe({
        next: () => {
          alert('Usuario actualizado correctamente');
          this.limpiarFormulario();
          this.obtenerUsuarios();
        },
        error: err => {
          console.error('Error al actualizar usuario:', err);
          alert('Error al actualizar usuario');
        }
      });

      return;
    }

    this.api.post('usuarios', this.usuario).subscribe({
      next: () => {
        alert('Usuario guardado correctamente');
        this.limpiarFormulario();
        this.obtenerUsuarios();
      },
      error: err => {
        console.error('Error al guardar usuario:', err);
        alert('Error al guardar usuario');
      }
    });
  }

  editarUsuario(u: any) {
    this.editando = true;
    this.usuarioIdEditando = u.id;

    this.usuario = {
      nombreUsuario: u.nombreUsuario || '',
      password: '',
      rol: u.rol || 'USUARIO',
      estado: Boolean(u.estado)
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.editando = false;
    this.usuarioIdEditando = null;

    this.usuario = {
      nombreUsuario: '',
      password: '',
      rol: 'USUARIO',
      estado: true
    };
  }

  eliminarUsuario(id: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar este usuario?');

    if (!confirmar) return;

    this.api.delete('usuarios', id).subscribe({
      next: () => this.obtenerUsuarios(),
      error: err => console.error('Error al eliminar usuario:', err)
    });
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.obtenerUsuarios();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas()) {
      this.pagina++;
      this.obtenerUsuarios();
    }
  }

  totalPaginas() {
    return Math.ceil(this.total / this.limite) || 1;
  }
}