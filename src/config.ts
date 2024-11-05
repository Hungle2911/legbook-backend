import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_COOKIE_ONE: string | undefined;
  public SECRET_COOKIE_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public REDIS_URL: string | undefined;
  public CLOUDINARY_CLOUD_NAME: string | undefined;
  public CLOUDINARY_API_KEY: string | undefined;
  public CLOUDINARY_API_SECRET: string | undefined;

  private DEFAULT_DATABASE_URL = 'mongodb://localhost:27017/legbook-backend';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_COOKIE_ONE = process.env.SECRET_COOKIE_ONE || '';
    this.SECRET_COOKIE_TWO = process.env.SECRET_COOKIE_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.REDIS_URL = process.env.REDIS_URL || '';
    this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
  }

  public getLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const key in this) {
      if (this[key] === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_CLOUD_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET,
    });
  }
}
export const config: Config = new Config();
