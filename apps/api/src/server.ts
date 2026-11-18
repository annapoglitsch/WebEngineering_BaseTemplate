import { app } from './app.js';
import { env } from './env.js';

const start = async (): Promise<void> => {
  try {
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
