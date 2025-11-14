import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003);
  console.log('🚀 Gateway running on http://localhost:3003');
}
bootstrap().catch((err) => {
  console.error('App startup error:', err);
});
