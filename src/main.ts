import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  app.enableVersioning({
    type: VersioningType.URI, // You can use URI, Header, or Media Type
  });
  await app.listen(port);
  console.log(`Server is running at http://localhost:${port}`);
}

bootstrap();
