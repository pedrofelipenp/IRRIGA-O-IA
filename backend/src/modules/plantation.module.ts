import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

import { Plantation } from '../entities/plantation.entity';
import { IrrigationLog } from '../entities/irrigation-log.entity';
import { PlantationService } from '../services/plantation.service';
import { WeatherService } from '../services/weather.service';
import { PlantationController } from '../controllers/plantation.controller';
import { IrrigationSchedulerService } from '../services/irrigation-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plantation, IrrigationLog]),
    HttpModule,
    ScheduleModule.forRoot(), // Importante para o Cron Job
  ],
  controllers: [PlantationController],
  providers: [PlantationService, WeatherService, IrrigationSchedulerService],
  exports: [PlantationService], // Exportado caso precise ser usado em outros módulos
})
export class PlantationModule {}
