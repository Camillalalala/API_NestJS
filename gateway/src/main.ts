import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';

async function bootstrap() {
  const server: Express = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Enable CORS for local frontend (e.g., http://localhost:5500)
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const proxies: Array<{ path: string; target: string }> = [
    { path: '/auth', target: 'http://localhost:3000' },
    { path: '/clubs', target: 'http://localhost:3001' },
    { path: '/events', target: 'http://localhost:3002' },
    { path: '/notifications', target: 'http://localhost:3004' },
    { path: '/users', target: 'http://localhost:3005' },
  ];

  proxies.forEach(({ path, target }) => {
    console.log(`Registering proxy: ${path} -> ${target}`);
    server.use(path, (req, res, next) => {
      console.log('Gateway received:', req.method, req.originalUrl);
      next();
    });
    server.use(
      path,
      createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (p) => p,
      }),
    );
  });

  await app.listen(3003);
  console.log('Gateway running on http://localhost:3003');
}

bootstrap().catch(console.error);
