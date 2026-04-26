
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SESSION_COOKIE_NAME } from '../presentation/common/auth/session/consts';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
    }),
  );
  app.enableCors({
    origin: true, // разрешить любые origin
    credentials: true, // если нужны cookies/auth headers
  });
  const config = new DocumentBuilder()
    .setTitle('Structured Wiki API')
    .setDescription('API for structured wiki with Neo4j & Elasticsearch')
    .setVersion('1.0')
    .addCookieAuth(SESSION_COOKIE_NAME, { type: 'apiKey', in: 'cookie', name: SESSION_COOKIE_NAME })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();

