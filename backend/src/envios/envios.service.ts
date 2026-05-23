import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Envio } from './envio.entity';
import { Encomienda } from '../encomiendas/encomienda.entity';
import { Sucursal } from '../sucursales/sucursal.entity';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private repo: Repository<Envio>,

    @InjectRepository(Encomienda)
    private encomiendaRepo: Repository<Encomienda>,

    @InjectRepository(Sucursal)
    private sucursalRepo: Repository<Sucursal>
  ) {}

  async findAll(q: string = '', page = 1, limit = 10) {
    const qb = this.repo
      .createQueryBuilder('envio')
      .leftJoin(Encomienda, 'encomienda', 'encomienda.id = envio.encomiendaId')
      .leftJoin(Sucursal, 'origen', 'origen.id = envio.sucursalOrigenId')
      .leftJoin(Sucursal, 'destino', 'destino.id = envio.sucursalDestinoId')
      .select([
        'envio.id AS id',
        'envio.encomiendaId AS "encomiendaId"',
        'encomienda.codigo AS encomienda',
        'envio.sucursalOrigenId AS "sucursalOrigenId"',
        'origen.nombre AS origen',
        'envio.sucursalDestinoId AS "sucursalDestinoId"',
        'destino.nombre AS destino',
        'envio.fechaEnvio AS "fechaEnvio"',
        'envio.fechaEstimada AS "fechaEstimada"',
        'envio.costo AS costo',
        'envio.estadoId AS "estadoId"'
      ])
      .orderBy('envio.id', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const busqueda = q?.trim();

    if (busqueda) {
      qb.where('encomienda.codigo ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('origen.nombre ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('destino.nombre ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('CAST(envio.costo AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere(
          `CASE
            WHEN envio.estadoId = 1 THEN 'Pendiente'
            WHEN envio.estadoId = 2 THEN 'En tránsito'
            WHEN envio.estadoId = 3 THEN 'Entregado'
            ELSE 'Sin estado'
          END ILIKE :q`,
          { q: `%${busqueda}%` }
        );
    }

    const dataRaw = await qb.getRawMany();

    const countQb = this.repo
      .createQueryBuilder('envio')
      .leftJoin(Encomienda, 'encomienda', 'encomienda.id = envio.encomiendaId')
      .leftJoin(Sucursal, 'origen', 'origen.id = envio.sucursalOrigenId')
      .leftJoin(Sucursal, 'destino', 'destino.id = envio.sucursalDestinoId');

    if (busqueda) {
      countQb
        .where('encomienda.codigo ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('origen.nombre ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('destino.nombre ILIKE :q', { q: `%${busqueda}%` })
        .orWhere('CAST(envio.costo AS TEXT) ILIKE :q', { q: `%${busqueda}%` })
        .orWhere(
          `CASE
            WHEN envio.estadoId = 1 THEN 'Pendiente'
            WHEN envio.estadoId = 2 THEN 'En tránsito'
            WHEN envio.estadoId = 3 THEN 'Entregado'
            ELSE 'Sin estado'
          END ILIKE :q`,
          { q: `%${busqueda}%` }
        );
    }

    const total = await countQb.getCount();

    const data = dataRaw.map((e: any) => ({
      id: e.id,
      encomiendaId: e.encomiendaId,
      encomienda: e.encomienda,
      sucursalOrigenId: e.sucursalOrigenId,
      origen: e.origen,
      sucursalDestinoId: e.sucursalDestinoId,
      destino: e.destino,
      fechaEnvio: e.fechaEnvio,
      fechaEstimada: e.fechaEstimada,
      costo: e.costo,
      estadoId: e.estadoId,
      estado:
        Number(e.estadoId) === 1
          ? 'Pendiente'
          : Number(e.estadoId) === 2
          ? 'En tránsito'
          : Number(e.estadoId) === 3
          ? 'Entregado'
          : 'Sin estado'
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

  create(data: Partial<Envio>) {
    return this.repo.save(
      this.repo.create(data)
    );
  }

  async update(id: number, data: Partial<Envio>) {
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