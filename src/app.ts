import express, { Express } from 'express';
import { LegBookServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabases';
import { config } from '@root/config';

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
    config.cloudinaryConfig()
  }
}
const application: Application = new Application();
application.initialize();
