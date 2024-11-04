import mongoose from 'mongoose';
import { config } from './config';
import Logger from 'bunyan';

const logger: Logger = config.getLogger('database');
export default () => {
  const connect = async () => {
    try {
      await mongoose.connect(config.DATABASE_URL!);
      logger.info('Connected to database successfully');
    } catch (error) {
      logger.error('Error connecting to database', error);
      process.exit(1);
    }
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
