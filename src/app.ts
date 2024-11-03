import express, {Express} from 'express';
import { LegBookServer } from './setupServer';
class Application {
  public initialize(): void {
    const app: Express = express();
    const legBookServer: LegBookServer = new LegBookServer(app);
    legBookServer.start();
  }
}
const application: Application = new Application();
application.initialize();