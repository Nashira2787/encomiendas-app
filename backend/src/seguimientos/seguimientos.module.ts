import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Seguimiento } from './seguimiento.entity';
import { Envio } from '../envios/envio.entity';

import { SeguimientosService } from './seguimientos.service';
import { SeguimientosController } from './seguimientos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Seguimiento,
      Envio
    ])
  ],
  providers: [
    SeguimientosService
  ],
  controllers: [
    SeguimientosController
  ],
  exports: [
    SeguimientosService
  ]
})
export class SeguimientosModule {}