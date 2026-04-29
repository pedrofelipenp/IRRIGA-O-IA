import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlantationService } from './plantation.service';

@Injectable()
export class IrrigationSchedulerService {
  private readonly logger = new Logger(IrrigationSchedulerService.name);

  constructor(private readonly plantationService: PlantationService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Iniciando avaliação automática de necessidade de irrigação (Cron Job)...');
    await this.plantationService.evaluateIrrigationNeeds();
  }
}
