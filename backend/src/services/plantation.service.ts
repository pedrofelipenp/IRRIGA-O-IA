import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plantation, IrrigationStatus } from '../entities/plantation.entity';
import { IrrigationLog } from '../entities/irrigation-log.entity';
import { WeatherService } from './weather.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PlantationService {
  private readonly logger = new Logger(PlantationService.name);

  constructor(
    @InjectRepository(Plantation)
    private readonly plantationRepository: Repository<Plantation>,
    @InjectRepository(IrrigationLog)
    private readonly logRepository: Repository<IrrigationLog>,
    private readonly weatherService: WeatherService,
  ) {}

  async create(data: Partial<Plantation>): Promise<Plantation> {
    const newPlantation = this.plantationRepository.create(data);
    return await this.plantationRepository.save(newPlantation);
  }

  async findAll(): Promise<Plantation[]> {
    return await this.plantationRepository.find();
  }

  /**
   * Função executada via Cron Job a cada 1 hora para avaliar e atualizar os status de rega.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async evaluateIrrigationNeeds() {
    this.logger.log('Iniciando avaliação de necessidade de irrigação para todas as hortas...');
    const plantations = await this.findAll();

    for (const plantation of plantations) {
      const shouldIrrigate = await this.weatherService.shouldIrrigate({
        lat: plantation.latitude,
        lon: plantation.longitude,
      });

      const previousStatus = plantation.status;
      const newStatus = shouldIrrigate ? IrrigationStatus.ACTIVE : IrrigationStatus.PAUSED;

      // Se houver mudança de status, atualizamos o banco e geramos o log
      if (previousStatus !== newStatus) {
        plantation.status = newStatus;
        await this.plantationRepository.save(plantation);

        const reason = shouldIrrigate ? 'Clima favorável para rega' : 'Previsão de Chuva';
        
        await this.logRepository.save({
          plantation,
          previousStatus,
          newStatus,
          reason,
        });

        this.logger.log(`Status da plantação '${plantation.name}' atualizado de ${previousStatus} para ${newStatus}. Motivo: ${reason}`);
      }
    }
  }

  // Permite forçar a reavaliação manualmente (via API)
  async forceEvaluation(): Promise<void> {
    await this.evaluateIrrigationNeeds();
  }
}
