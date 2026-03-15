import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { AdminSeeder } from './seeders/admin.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  const seeder = appContext.get(AdminSeeder);
  await seeder.run();

  await appContext.close();
}

bootstrap();
