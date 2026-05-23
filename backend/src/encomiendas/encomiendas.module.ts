import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encomienda } from './encomienda.entity';
import { EncomiendasService } from './encomiendas.service';
import { EncomiendasController } from './encomiendas.controller';
@Module({ imports:[TypeOrmModule.forFeature([Encomienda])], providers:[EncomiendasService], controllers:[EncomiendasController], exports:[EncomiendasService] })
export class EncomiendasModule {}
