import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaOptionsFactory } from '@lab/shared/kafka';
import { TransactionAppModule } from './module/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(TransactionAppModule);
  const config = app.get(ConfigService);

  const host = config.get<string>('HTTP_HOST')!;
  const port = config.get<string>('HTTP_PORT')!;
  const prefix = config.get<string>('HTTP_PREFIX')!;
  const serviceName = config.get<string>('SERVICE_NAME')!;

  app.setGlobalPrefix(prefix);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    whitelist: true,
  }));

  app.connectMicroservice<MicroserviceOptions>(kafkaOptionsFactory(config));

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${serviceName} microservice`)
    .setDescription('Transaction service API')
    .addServer(`http://${host}:${port}`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  await app.startAllMicroservices();
  await app.listen(Number(port), host);

  console.log(`Transaction: http://${host}:${port}${prefix}`);
  console.log(`Swagger: http://${host}:${port}${prefix}/docs`);
}
bootstrap();