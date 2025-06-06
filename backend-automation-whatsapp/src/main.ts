import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors = require('cors')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  await app.listen(3001);
}
bootstrap();
