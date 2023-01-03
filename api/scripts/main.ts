import { CommandFactory } from 'nest-commander';
import { AppModule } from '../src/app.module';

async function bootstrap() {
  await CommandFactory.run(AppModule, ['warn', 'error', 'debug', 'log']);
}

bootstrap();
