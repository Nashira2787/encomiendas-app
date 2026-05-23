import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private repo: Repository<Cliente>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('cliente')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('cliente.id', 'DESC');

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('cliente.nombre ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('cliente.apellido ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('cliente.ci ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('cliente.telefono ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('cliente.email ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('cliente.direccion ILIKE :q', { q: `%${busqueda}%` });
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

  create(data: Partial<Cliente>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Cliente>) {
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