export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export const configProvider = {
  provide: 'CONFIG',
  useValue: {
    //TODO прочесть переменнные среды
    database: {
      driver: process.env.DATABASE_DRIVER ?? 'mongodb',
      url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/film',
    },
  } satisfies AppConfig,
};
