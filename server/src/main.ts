import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      /^chrome-extension:\/\/*/,
      'https://leetflash.com/',
    ],
  });
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('LeetFlash 1.0')
    .setDescription('LeetFlash 1.0 API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions = {
    customSiteTitle: 'LeetFlash 1.0 API Doc',
  };
  SwaggerModule.setup('api/swagger', app, document, customOptions);

  await app.listen(
    process.env.NODE_ENV === 'production' ? process.env.PORT : 3030,
  );
}
bootstrap();
