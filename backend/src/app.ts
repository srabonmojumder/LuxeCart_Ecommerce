import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './lib/env.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';
import { UPLOAD_DIR } from './controllers/uploads.controller.js';

export function createApp() {
  const app = express();

  // Allow <img>/<Image> on the storefront to load uploaded files cross-origin.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );
  app.use(cookieParser());

  // Serve uploaded product images.
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Stripe webhook needs the raw body for signature verification, so it must
  // bypass the JSON body parser.
  app.use((req, res, next) => {
    if (req.originalUrl === '/api/payments/webhook') {
      express.raw({ type: 'application/json' })(req, res, next);
    } else {
      express.json()(req, res, next);
    }
  });
  app.use(express.urlencoded({ extended: true }));
  if (env.NODE_ENV !== 'test') app.use(morgan('dev'));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
