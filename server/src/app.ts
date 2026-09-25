import express from 'express';
import cors from 'cors';
import { dishesRouter } from './routes/dishes.routes';
import { stopListRouter } from './routes/stopList.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

    app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://stop-list-task.vercel.app',
      'https://stop-list-task-v9kl.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
  app.use(express.json());

  app.use('/api/dishes', dishesRouter);
  app.use('/api/stop-list', stopListRouter);

  app.use(errorHandler);

  return app;
}