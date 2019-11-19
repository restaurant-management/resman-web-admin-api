import 'reflect-metadata';
import { Application } from './src/lib/application';
import seedData from './src/seeder';

// Config to use environment variable
Application.createTypeOrmConnection().then(async connection => {
    console.info('Clear database for testing');

    await connection.dropDatabase();
    await connection.runMigrations();

    await seedData();
});
