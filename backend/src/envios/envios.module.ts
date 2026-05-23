import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Envio } from './envio.entity';
import { Encomienda } from '../encomiendas/encomienda.entity';
import { Sucursal } from '../sucursales/sucursal.entity';

import { EnviosService } from './envios.service';
import { EnviosController } from './envios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Envio,
      Encomienda,
      Sucursal
    ])
  ],
  providers: [
    EnviosService
  ],
  controllers: [
    EnviosController
  ],
  exports: [
    EnviosService
  ]
})
export class EnviosModule {}