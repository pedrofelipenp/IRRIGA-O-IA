import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantationModule } from './modules/plantation.module';
import { Plantation } from './entities/plantation.entity';
import { IrrigationLog } from './entities/irrigation-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Disponibiliza o .env em toda a aplicação
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Plantation, IrrigationLog],
        synchronize: true, // Cria as tabelas automaticamente no DB (apenas para dev)
      }),
    }),
    PlantationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
