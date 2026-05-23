import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const API = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<any>(JSON.parse(localStorage.getItem('usuario') || 'null'));

  constructor(private http: HttpClient, private router: Router) {}

  login(nombreUsuario: string, password: string) {
    return this.http.post<any>(`${API}/api/auth/login`, {
      nombreUsuario,
      password
    });
  }

  guardarSesion(resp: any) {
    localStorage.setItem('token', resp.access_token);
    localStorage.setItem('usuario', JSON.stringify(resp.usuario));
    this.usuario.set(resp.usuario);
    this.router.navigateByUrl('/dashboard');
  }

  logout() {
    localStorage.clear();
    this.usuario.set(null);
    this.router.navigateByUrl('/login');
  }
}