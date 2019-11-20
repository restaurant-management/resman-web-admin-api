import { seedFakeData } from './fakeData.seeder';
import { seedRole } from './role.seeder';
import { seedUser } from './user.seeder';

export default async function seedData() {
    console.log('Seeding...');

    await seedRole();
    await seedUser();

    if (process.env.NODE_ENV !== 'production') {
        await seedFakeData();
    }
}
