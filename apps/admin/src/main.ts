import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { AllFillterException } from '@app/exceptions';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  morgan.token('body', function (req: any) {
    return JSON.stringify(req?.body ?? '{}');
  });

  app.use(
    morgan(
      ':remote-addr :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" data::body :response-time ms',
      {
        skip: function (req, res) {
          return res.statusCode < 400;
        },
      },
    ),
  );

  app.set('trust proxy', true);
  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  if (configService.get('SWAGGER') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Admin API specs')
      .setDescription('The API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false,
      }),
    );
  } else {
    app.use(
      helmet({
        crossOriginResourcePolicy: false,
      }),
    );
  }

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllFillterException(httpAdapter));

  const port = configService.get<number>('server.ADMIN_PORT') || 3001;
  await app.listen(port, () => {
    Logger.log('API is listening on port: ' + port);
  });
}
bootstrap();
