import express from 'express';
import cors from 'cors';
import { dishesRouter } from './routes/dishes.routes';
import { stopListRouter } from './routes/stopList.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/dishes', dishesRouter);
  app.use('/api/stop-list', stopListRouter);

  app.use(errorHandler);

  return app;
}