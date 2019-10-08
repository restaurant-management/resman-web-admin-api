import { seedRole } from './role.seeder';
import { seedUser } from './user.seeder';

export default async function seedData() {
    seedRole();
    seedUser();
}
