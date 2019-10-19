import { getConnection } from 'typeorm';
import { Permission } from '../entity/permission';
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
                    level: 5,
                    name: 'Administrator',
                    permissions: Permission.toArray(),
                    slug: 'administrator'
                }
            ])
            .execute();

        console.log('Seeded role!');
    }
};
