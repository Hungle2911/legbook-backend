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

export class Server {
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
        keys: ["key1", "key2"],
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
      }),
    );
    app.use(cors(
      {
        origin: "http://localhost:5173",
        credentials: true,
      },
    ));
    app.use(helmet());
  }

  private standardMiddlewares(app: Application): void {
    app.use(compression());
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(morgan("dev"));
  }

  private routeMiddlewares(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private startServer(app: Application): void {}

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {}
}