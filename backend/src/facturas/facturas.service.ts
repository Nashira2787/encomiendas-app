import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private repo: Repository<Factura>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('factura')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('factura.id', 'DESC');

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('factura.nit ILIKE :q', {
        q: `%${busqueda}%`
      })
      .orWhere('factura.razonSocial ILIKE :q', {
        q: `%${busqueda}%`
      });
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
      throw new NotFoundException(
        'Registro no encontrado'
      );
    }

    return item;
  }

  create(data: Partial<Factura>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Factura>) {
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