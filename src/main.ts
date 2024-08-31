import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.use(morgan('combined'));

  app.useGlobalPipes(
    new ValidationPipe({ stopAtFirstError: true, whitelist: true }),
  );

  app.use(
    bodyParser.json({
      verify: (req, res, buffer) => (req['rawBody'] = buffer),
    }),
  );

  app.use(compression());

  app.use(helmet());

  app.enableCors({
    origin: '*',
    preflightContinue: true,
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, XMLHttpRequest',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('The E-commerce API description')
    .setVersion('1.0')
    .addTag('e-commerce')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`E-commerce API is listening on: http://localhost:${port} 🚀`);
}

bootstrap();
