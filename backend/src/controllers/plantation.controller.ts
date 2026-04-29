import { Controller, Get, Post, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PlantationService } from '../services/plantation.service';
import { Plantation } from '../entities/plantation.entity';
import { CreatePlantationDto } from '../dto/create-plantation.dto';

@ApiTags('Plantations')
@Controller('plantations')
export class PlantationController {
  constructor(private readonly plantationService: PlantationService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova Horta' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlantationDto: CreatePlantationDto): Promise<Plantation> {
    return await this.plantationService.create(createPlantationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as hortas cadastradas (com paginação)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Plantation[], total: number }> {
    return await this.plantationService.findAll(page, limit);
  }

  @Post('evaluate')
  @ApiOperation({ summary: 'Forçar avaliação climática imediata' })
  @HttpCode(HttpStatus.OK)
  async forceEvaluation(): Promise<{ message: string }> {
    await this.plantationService.forceEvaluation();
    return { message: 'Avaliação de irrigação executada com sucesso!' };
  }
}
