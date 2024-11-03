import express, {Express} from 'express';
import { LegBookServer } from './setupServer';
import databaseConnection from './setupDatabases';

class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();
    const legBookServer: LegBookServer = new LegBookServer(app);
    legBookServer.start();
  }
}
const application: Application = new Application();
application.initialize();