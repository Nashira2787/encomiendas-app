import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('usuario')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('usuario.id', 'DESC');

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('usuario.nombreUsuario ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('usuario.rol ILIKE :q', { q: `%${busqueda}%` })
        .orWhere(
          `CASE
            WHEN usuario.estado = true THEN 'Activo'
            ELSE 'Inactivo'
          END ILIKE :q`,
          { q: `%${busqueda}%` }
        );
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit
    };
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id } as any);

    if (!item) {
      throw new NotFoundException('Registro no encontrado');
    }

    return item;
  }

  create(data: Partial<Usuario>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Usuario>) {
    const item = await this.findOne(id);
    Object.assign(item, data);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);

    return {
      ok: true
    };
  }
}