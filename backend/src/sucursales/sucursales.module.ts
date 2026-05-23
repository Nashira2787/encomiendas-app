import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './sucursal.entity';
import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
@Module({ imports:[TypeOrmModule.forFeature([Sucursal])], providers:[SucursalesService], controllers:[SucursalesController], exports:[SucursalesService] })
export class SucursalesModule {}
