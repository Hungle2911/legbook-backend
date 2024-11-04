import express, { Express } from 'express';
import { LegBookServer } from './setupServer';
import databaseConnection from './setupDatabases';
import { config } from './config';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const legBookServer: LegBookServer = new LegBookServer(app);
    legBookServer.start();
  }

  private loadConfig(): void {
    // Make sure all required environment variables are set
    config.validateConfig();
  }
}
const application: Application = new Application();
application.initialize();
