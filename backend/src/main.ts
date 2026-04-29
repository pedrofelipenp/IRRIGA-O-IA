import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Tratamento Global de Erros
  app.useGlobalFilters(new AllExceptionsFilter());

  // Habilita as validações globalmente baseadas nos DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuração Automática da Documentação (Swagger)
  const config = new DocumentBuilder()
    .setTitle('Irrigation AI API')
    .setDescription('API do Sistema de Irrigação Inteligente com cruzamento de dados climáticos')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
