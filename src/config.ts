import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN_SECRET: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_COOKIE_ONE: string | undefined;
  public SECRET_COOKIE_TWO: string | undefined;
  public CLIENT_URL: string | undefined;

  private DEFAULT_DATABASE_URL = 'mongodb://localhost:27017/legbook-backend';

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABASE_URL;
    this.JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '1234';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.SECRET_COOKIE_ONE = process.env.SECRET_COOKIE_ONE || '';
    this.SECRET_COOKIE_TWO = process.env.SECRET_COOKIE_TWO || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
  }

  public validateConfig(): void {
    for (const key in this) {
      if (this[key] === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }
  }
}
export const config: Config = new Config;