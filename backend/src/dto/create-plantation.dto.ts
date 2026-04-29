import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantationDto {
  @ApiProperty({ example: 'Horta Sul', description: 'Nome da Plantação' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Milho', description: 'Tipo da cultura' })
  @IsString()
  @IsNotEmpty()
  cropType: string;

  @ApiProperty({ example: -23.55052, description: 'Latitude', minimum: -90, maximum: 90 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: -46.633308, description: 'Longitude', minimum: -180, maximum: 180 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
