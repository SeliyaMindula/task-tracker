import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all origins (customize as needed)
  app.enableCors({
    origin: '*', // Or specify ['http://localhost:3000'] for more security
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Task Tracker API')
    .setDescription('API documentation for Task Tracker Pro')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
