import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './sucursal.entity';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private repo: Repository<Sucursal>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('sucursal')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('sucursal.id', 'DESC');

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('sucursal.nombre ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('sucursal.direccion ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('sucursal.ciudad ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('sucursal.telefono ILIKE :q', { q: `%${busqueda}%` });
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

  create(data: Partial<Sucursal>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Sucursal>) {
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