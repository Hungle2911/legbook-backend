import {Application, json, urlencoded, Response, Request, NextFunction} from "express";
import http from "http";
import cors from "cors"
import helmet from "helmet";
import compression = require("compression")
import hpp from "hpp";
import morgan from "morgan";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors"
import { config } from "./config";

const SERVER_PORT = 8000;
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
        name: "session",
        keys: [config.SECRET_COOKIE_ONE!, config.SECRET_COOKIE_TWO!],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV !== "development",
      }),
    );
    app.use(cors(
      {
        origin: config.CLIENT_URL,
        credentials: true,
      },
    ));
    app.use(helmet());
    app.use(hpp());
  }

  private standardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(morgan("dev"));
  }

  private routeMiddlewares(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);

    } catch (error) {
      console.error(error);
    }
  }

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    }
    );
  }
}