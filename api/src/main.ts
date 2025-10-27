import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Servir archivos estáticos desde la carpeta public
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setGlobalPrefix('api');
  app.enableCors();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  Logger.log(`🚀 Servidor corriendo en: http://localhost:${PORT}/api`);
  Logger.log(
    `📁 Archivos estáticos disponibles en: http://localhost:${PORT}/uploads`,
  );
}
bootstrap();
