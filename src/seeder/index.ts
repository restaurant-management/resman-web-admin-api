import { seedRole } from './role.seeder';
import { seedUser } from './user.seeder';
import { seedFakeData } from './fakeData.seeder';

export default async function seedData() {
    seedRole();
    seedUser();

    if (process.env.NODE_ENV !== 'production') {
        seedFakeData();
    }
}
