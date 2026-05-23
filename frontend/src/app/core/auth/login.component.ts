import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
<div class="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 p-4">
  <div class="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl"></div>
  <div class="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"></div>

  <form class="glass relative w-full max-w-md space-y-5 p-8" (ngSubmit)="entrar()">
    <div class="text-center">
      <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-blue-600 text-2xl font-black text-white shadow-xl shadow-blue-600/30">E</div>
      <h1 class="text-3xl font-black text-slate-900">Sistema de Encomiendas</h1>
      <p class="mt-2 text-sm text-slate-500">Administra clientes, envíos, pagos y seguimiento</p>
    </div>

    <label class="block text-sm font-bold text-slate-700">Usuario
      <input class="input mt-2" placeholder="admin" [(ngModel)]="nombreUsuario" name="u">
    </label>
    <label class="block text-sm font-bold text-slate-700">Contraseña
      <input class="input mt-2" placeholder="123" type="password" [(ngModel)]="password" name="p">
    </label>

    <button class="btn-primary w-full py-3">Ingresar al sistema</button>
    @if(error()){
      <p class="rounded-2xl bg-rose-50 p-3 text-center text-sm font-semibold text-rose-600">{{error()}}</p>
    }
    <p class="text-center text-xs text-slate-500">Prueba: admin / 123</p>
  </form>
</div>
  `
})
export class LoginComponent {
  nombreUsuario = 'admin';
  password = '123';
  error = signal('');
  constructor(private auth: AuthService) {}
  entrar() {
    this.auth.login(this.nombreUsuario, this.password).subscribe({
      next: r => this.auth.guardarSesion(r),
      error: () => this.error.set('Usuario o contraseña incorrectos')
    });
  }
}
