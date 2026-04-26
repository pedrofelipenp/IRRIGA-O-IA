import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PlantationService } from '../services/plantation.service';
import { Plantation } from '../entities/plantation.entity';

// DTO Básico (Data Transfer Object)
class CreatePlantationDto {
  name: string;
  cropType: string;
  latitude: number;
  longitude: number;
}

@Controller('plantations')
export class PlantationController {
  constructor(private readonly plantationService: PlantationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlantationDto: CreatePlantationDto): Promise<Plantation> {
    return await this.plantationService.create(createPlantationDto);
  }

  @Get()
  async findAll(): Promise<Plantation[]> {
    return await this.plantationService.findAll();
  }

  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async forceEvaluation(): Promise<{ message: string }> {
    await this.plantationService.forceEvaluation();
    return { message: 'Avaliação de irrigação executada com sucesso!' };
  }
}
