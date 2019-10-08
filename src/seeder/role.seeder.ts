import { getConnection } from 'typeorm';
import { Role } from '../entity/role';

export const seedRole = async () => {
    const [, roleCount] = await Role.findAndCount();

    if (roleCount <= 0) {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values([
                {
                    slug: 'administrator',
                    name: 'Administrator',
                    level: 5,
                    permissions: []
                }
            ])
            .execute();

        console.log('Seeded role!');
    }
};
