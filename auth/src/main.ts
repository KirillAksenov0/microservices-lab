import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AuthAppModule } from './module/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AuthAppModule);

  const configService = app.get(ConfigService);

  const host = configService.get<string>('HTTP_HOST') || 'localhost';
  const port = Number(configService.get<string>('HTTP_PORT') || 9001);
  const prefix = configService.get<string>('HTTP_PREFIX') || '/api/auth';
  const serviceName =
    configService.get<string>('SERVICE_NAME') || 'auth';

  app.setGlobalPrefix(prefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${serviceName} microservice`)
    .setDescription('Auth service API')
    .setVersion('1.0')
    .addServer(`http://${host}:${port}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(`${prefix}/docs`, app, document);

  await app.listen(port, host);

  console.log(
    `Auth service started: http://${host}:${port}${prefix}`,
  );

  console.log(
    `Swagger: http://${host}:${port}${prefix}/docs`,
  );
}

bootstrap();
