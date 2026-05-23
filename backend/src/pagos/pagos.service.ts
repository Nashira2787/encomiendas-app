import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pago.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private repo: Repository<Pago>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('pago')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('pago.id', 'DESC');

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('CAST(pago.envioId AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('pago.metodo ILIKE :q', { q: `%${busqueda}%` });
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

  create(data: Partial<Pago>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Pago>) {
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