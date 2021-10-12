import * as yargs from 'yargs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminsService } from './auth/admins/admins.service';

async function registerAdmin(
  username: string,
  password: string,
): Promise<void> {
  const context = await NestFactory.createApplicationContext(AppModule);

  try {
    const adminsService = context.get(AdminsService);
    await adminsService.register({ username, password });
  } finally {
    await context.close();
  }
}

function handleError(error: Error): void {
  console.error('Admin registration failed.', error);
  process.exitCode = 1;
}

yargs
  .usage('Register admin: $0 [options]')
  .option('username', {
    type: 'string',
    demandOption: true,
    description: "Admin's username",
  })
  .option('password', {
    type: 'string',
    demandOption: true,
    description: "Admin's password",
  })
  .parseAsync()
  .then((argv) => registerAdmin(argv.username, argv.password))
  .catch(handleError);
