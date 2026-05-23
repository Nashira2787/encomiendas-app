import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ClientesModule } from './clientes/clientes.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { EncomiendasModule } from './encomiendas/encomiendas.module';
import { EnviosModule } from './envios/envios.module';
import { SeguimientosModule } from './seguimientos/seguimientos.module';
import { PagosModule } from './pagos/pagos.module';
import { FacturasModule } from './facturas/facturas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ type: 'postgres', host: process.env.DB_HOST || 'localhost', port: +(process.env.DB_PORT || 5432), username: process.env.DB_USER || 'postgres', password: process.env.DB_PASS || 'postgres', database: process.env.DB_NAME || 'encomiendas_db', autoLoadEntities: true, synchronize: false }),
    AuthModule, ClientesModule, SucursalesModule, EncomiendasModule, EnviosModule, SeguimientosModule, PagosModule, FacturasModule, UsuariosModule,
  ],
})
export class AppModule {}
