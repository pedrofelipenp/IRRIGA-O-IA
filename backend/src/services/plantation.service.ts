import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plantation, IrrigationStatus } from '../entities/plantation.entity';
import { IrrigationLog } from '../entities/irrigation-log.entity';
import { WeatherService } from './weather.service';

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

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Plantation[], total: number }> {
    const [data, total] = await this.plantationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  /**
   * Função executada para avaliar e atualizar os status de rega.
   */
  async evaluateIrrigationNeeds() {
    this.logger.log('Iniciando avaliação de necessidade de irrigação para todas as hortas...');
    
    // Pegando as hortas paginadas (neste caso, as primeiras 1000 para o cron)
    const result = await this.findAll(1, 1000);

    for (const plantation of result.data) {
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
