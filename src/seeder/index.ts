import { seedFakeData } from './fakeData.seeder';
import { seedRole } from './role.seeder';
import { seedUser } from './user.seeder';

export default async function seedData() {
    seedRole();
    seedUser();

    if (process.env.NODE_ENV !== 'production') {
        seedFakeData();
    }
}