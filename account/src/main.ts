import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { kafkaOptionsFactory } from '@lab/shared/kafka';

import { AccountAppModule } from './module/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AccountAppModule);

  const config = app.get(ConfigService);

  const httpHost = config.get<string>('HTTP_HOST');
  const httpPort = config.get<string>('HTTP_PORT');
  const httpPrefix = config.get<string>('HTTP_PREFIX');
  const serviceName = config.get<string>('SERVICE_NAME');

  if (!httpHost || !httpPort || !httpPrefix || !serviceName) {
    throw new Error(
      'HTTP_HOST, HTTP_PORT, HTTP_PREFIX, SERVICE_NAME must be defined',
    );
  }

  app.setGlobalPrefix(httpPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  // Подключение Kafka-консьюмера (для обработки события TransactionSaved)
  app.connectMicroservice<MicroserviceOptions>(
    kafkaOptionsFactory(config),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${serviceName} microservice`)
    .setDescription('Account service API')
    .setVersion('1.0')
    .addServer(`http://${httpHost}:${httpPort}`)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(`${httpPrefix}/docs`, app, document);

  // Запуск микросервисов (Kafka) ДО app.listen
  await app.startAllMicroservices();

  await app.listen(Number(httpPort), httpHost);

  console.log(
    `Account service started: http://${httpHost}:${httpPort}${httpPrefix}`,
  );
  console.log(
    `Swagger: http://${httpHost}:${httpPort}${httpPrefix}/docs`,
  );
}

bootstrap();