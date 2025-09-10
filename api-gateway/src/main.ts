import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  await app.listen(3002);
  console.log('API Gateway running on http://localhost:3002');
  console.log('GraphQL Playground available at http://localhost:3002/graphql');
}
bootstrap();