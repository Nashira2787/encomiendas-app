import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Seguimiento } from './seguimiento.entity';
import { Envio } from '../envios/envio.entity';

@Injectable()
export class SeguimientosService {
  constructor(
    @InjectRepository(Seguimiento)
    private repo: Repository<Seguimiento>,

    @InjectRepository(Envio)
    private envioRepo: Repository<Envio>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('seguimiento')
      .leftJoin(Envio, 'envio', 'envio.id = seguimiento.envioId')
      .select([
        'seguimiento.id AS id',
        'seguimiento.envioId AS "envioId"',
        'seguimiento.estadoId AS "estadoId"',
        'seguimiento.ubicacion AS ubicacion',
        'seguimiento.observaciones AS observaciones',
        'seguimiento.fecha AS fecha',
        `CASE
          WHEN seguimiento.estadoId = 1 THEN 'Pendiente'
          WHEN seguimiento.estadoId = 2 THEN 'En tránsito'
          WHEN seguimiento.estadoId = 3 THEN 'Entregado'
          ELSE 'Sin estado'
        END AS estado`,
        `CONCAT('Envío #', seguimiento.envioId) AS envio`
      ])
      .orderBy('seguimiento.id', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('CAST(seguimiento.envioId AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('seguimiento.ubicacion ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('seguimiento.observaciones ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('CAST(seguimiento.fecha AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere(
          `CASE
            WHEN seguimiento.estadoId = 1 THEN 'Pendiente'
            WHEN seguimiento.estadoId = 2 THEN 'En tránsito'
            WHEN seguimiento.estadoId = 3 THEN 'Entregado'
            ELSE 'Sin estado'
          END ILIKE :q`,
          { q: `%${busqueda}%` }
        );
    }

    const dataRaw = await qb.getRawMany();

    const countQb = this.repo
      .createQueryBuilder('seguimiento')
      .leftJoin(Envio, 'envio', 'envio.id = seguimiento.envioId');

    if (busqueda) {
      countQb
        .where('CAST(seguimiento.envioId AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('seguimiento.ubicacion ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('seguimiento.observaciones ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('CAST(seguimiento.fecha AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere(
          `CASE
            WHEN seguimiento.estadoId = 1 THEN 'Pendiente'
            WHEN seguimiento.estadoId = 2 THEN 'En tránsito'
            WHEN seguimiento.estadoId = 3 THEN 'Entregado'
            ELSE 'Sin estado'
          END ILIKE :q`,
          { q: `%${busqueda}%` }
        );
    }

    const total = await countQb.getCount();

    const data = dataRaw.map((s: any) => ({
      id: s.id,
      envioId: s.envioId,
      envio: s.envio,
      estadoId: s.estadoId,
      estado: s.estado,
      ubicacion: s.ubicacion,
      observaciones: s.observaciones,
      fecha: s.fecha
    }));

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

  create(data: Partial<Seguimiento>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Seguimiento>) {
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