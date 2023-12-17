import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getIpAddress } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('InStare API list')
    .setDescription(
      'Access token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDZjNjY2OGJkYTlhNzkzN2M2YmQxMGEiLCJlbWFpbCI6ImFAZ21haWwuY29tIiwiaWF0IjoxNzAxOTYyMDM2fQ.6qkvrvnbGnwP4yU0Y6rKb9BGhruLBuS6LiOAp5fMV4g',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    getIpAddress().forEach((ip) => {
      console.log(`IP: http://${ip}:${port}/`);
    });
    console.log(`NestJS app listening at http://localhost:${port}`);
  });
}
bootstrap();
