import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface WeatherForecastParams {
  lat: number;
  lon: number;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  
  // A chave de API idealmente viria de variáveis de ambiente usando @nestjs/config
  private readonly OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY || 'SUA_CHAVE_AQUI';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Avalia a previsão do tempo para as próximas 12 horas.
   * Regra: Se a probabilidade de chuva (pop) for > 60% ou chuva intensa for detectada,
   * devemos pausar a irrigação (retorna false). Caso contrário, mantém/ativa a rega (retorna true).
   */
  async shouldIrrigate(params: WeatherForecastParams): Promise<boolean> {
    try {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${params.lat}&lon=${params.lon}&exclude=current,minutely,daily,alerts&appid=${this.OPEN_WEATHER_API_KEY}&units=metric`;
      
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data;

      // Pegar as próximas 12 horas da previsão (hourly prediction)
      const next12Hours = data.hourly.slice(0, 12);

      for (const hour of next12Hours) {
        // `pop` (Probability of Precipitation) varia de 0 a 1 (ex: 0.6 = 60%)
        const probabilityOfPrecipitation = hour.pop;
        
        // Verifica se chove ou se a probabilidade é maior que 60%
        if (probabilityOfPrecipitation > 0.6) {
          this.logger.log(`Alta probabilidade de chuva (${probabilityOfPrecipitation * 100}%) detectada para as próximas horas.`);
          return false; // Não irrigar
        }

        // Verifica também volume de chuva (se tiver property rain.1h) > 2mm
        if (hour.rain && hour.rain['1h'] && hour.rain['1h'] > 2) {
            this.logger.log(`Volume de chuva considerável detectado (${hour.rain['1h']}mm).`);
            return false; // Não irrigar
        }
      }

      // Se passou pelas 12 horas e não previu chuva forte, pode irrigar.
      return true;
    } catch (error) {
      this.logger.error('Erro ao buscar dados climáticos na API do OpenWeatherMap', error.message);
      // Fallback seguro: Em caso de falha da API, podemos manter como true e emitir alerta, 
      // ou adotar cautela e retornar falso dependendo da regra de negócio da empresa.
      // Retornaremos true para não secar a plantação no caso de indisponibilidade externa.
      return true;
    }
  }
}
