import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para la API
  app.setGlobalPrefix('api/v1', {
    exclude: ['docs', 'docs-json', 'docs-yaml'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )

  // Configuración de CORS
  app.enableCors({
    origin: '*', //['https://zizicar.com', 'https://adm.zizicar.com', 'https://www.zizicar.com'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.use(bodyParser.json());

  // Configuración del Swagger
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
