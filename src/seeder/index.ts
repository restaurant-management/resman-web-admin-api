import { seedFakeData } from './fakeData.seeder';
import { seedRole } from './role.seeder';
import { seedStore } from './store.seeder';
import { seedUser } from './user.seeder';

export default async function seedData() {
    console.log('Seeding...');

    await seedStore();
    await seedRole();
    await seedUser();

    await seedFakeData();
    // if (process.env.NODE_ENV !== 'production') {
    //     await seedFakeData();
    // }
}
