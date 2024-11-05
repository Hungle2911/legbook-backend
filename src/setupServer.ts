import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import 'express-async-errors';
import { config } from '@root/config';
import applicationRouter from '@root/routes';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';
import Logger from 'bunyan';

const SERVER_PORT = 8000;
const logger: Logger = config.getLogger('server');

export class LegBookServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public start(): void {
    this.securityMiddlewares(this.app);
    this.standardMiddlewares(this.app);
    this.routeMiddlewares(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddlewares(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_COOKIE_ONE!, config.SECRET_COOKIE_TWO!],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV !== 'development'
      })
    );
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true
      })
    );
    app.use(helmet());
    app.use(hpp());
  }

  private standardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(morgan('dev'));
  }

  private routeMiddlewares(app: Application): void {
    applicationRouter(app);
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction): any => {
      logger.error(error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.startSocketIO(httpServer);
    } catch (error) {
      logger.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`Server is running on port ${SERVER_PORT}`);
    });
  }

  private startSocketIO(httpServer: http.Server): void {}
}
