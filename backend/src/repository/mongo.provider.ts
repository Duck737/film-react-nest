import mongoose from 'mongoose';
import { AppConfig } from 'src/app.config.provider';

export const mongoProvider = {
  provide: 'MONGO_CONNECTION',
  inject: ['CONFIG'],
  useFactory: async (config: AppConfig) => {
    return mongoose.connect(config.database.url);
  },
};
