import { getConnection } from 'typeorm';
import { Permission } from '../entity/permission';
import { Role } from '../entity/role';
import { RoleService } from '../service/role.service';

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
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values([
                {
                    level: 1,
                    name: 'Chef',
                    permissions: [],
                    slug: 'chef'
                }
            ])
            .execute();
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Role)
            .values([
                {
                    level: 1,
                    name: 'Staff',
                    permissions: [],
                    slug: 'staff'
                }
            ])
            .execute();

        await RoleService.create({ name: 'Ware Manager', slug: 'ware-manager', level: 1, permissions: [] });
        await RoleService.create({ name: 'Shipper', slug: 'shipper', level: 1, permissions: [] });

        console.log('Seeded role!');
    }
};
