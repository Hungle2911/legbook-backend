import mongoose from "mongoose";
export default () => {
    const connect = async () => {
      try {
        await mongoose.connect('mongodb://localhost:27017/legbook-backend');
        console.log('Connected to database successfully');
      } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
      }
    };
    connect();
    mongoose.connection.on('disconnected', connect);
  };
