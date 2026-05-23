import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(Usuario) private usuarios:Repository<Usuario>, private jwt:JwtService) {}
  async login(nombreUsuario:string, password:string){
    const user = await this.usuarios.findOne({ where:{ nombreUsuario, estado:true } });
    if(!user || user.password !== password) throw new UnauthorizedException('Credenciales inválidas');
    const payload = { sub:user.id, nombreUsuario:user.nombreUsuario, rol:user.rol };
    return { access_token:this.jwt.sign(payload), usuario:payload };
  }
}
