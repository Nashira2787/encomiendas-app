import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encomienda } from './encomienda.entity';

@Injectable()
export class EncomiendasService {
  constructor(
    @InjectRepository(Encomienda)
    private repo: Repository<Encomienda>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('encomienda')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('encomienda.id', 'DESC');

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('encomienda.codigo ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('encomienda.descripcion ILIKE :q', { q: `%${busqueda}%` });
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

  create(data: Partial<Encomienda>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Encomienda>) {
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