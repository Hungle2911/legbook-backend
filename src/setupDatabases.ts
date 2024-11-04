import mongoose from "mongoose";
import { config } from "./config";

export default () => {
    const connect = async () => {
      try {
        await mongoose.connect(config.DATABASE_URL!);
        console.log('Connected to database successfully');
      } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
      }
    };
    connect();
    mongoose.connection.on('disconnected', connect);
  };
