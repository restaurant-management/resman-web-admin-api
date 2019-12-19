import { __ } from 'i18n';
import { Permission } from '../entity/permission';
import { Role } from '../entity/role';
import { stringToSlug } from '../helper/slugHandler';

class RoleService {
    public async getAll(options: { length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' }) {
        const order = options.orderId ?
            { [options.orderId]: options.orderType === 'DESC' || options.orderType === '-1' ? -1 : 1 } : {};
        const skip = (options.page - 1) * options.length >= 0 ? (options.page - 1) * options.length : 0;
        const take = options.length;

        const role = await Role.find({ take, skip, order });

        return role;
    }

    public async create(data: {
        name: string, slug?: string, description?: string, level?: number, permissions?: string[]
    }) {
        if (!data.slug) { data.slug = stringToSlug(data.name); }

        let checkRole = null;
        try {
            checkRole = await this.getOne({ slug: data.slug });
            // tslint:disable-next-line: no-empty
        } catch (_) { }

        if (checkRole) {
            throw new Error(__('role.existed'));
        }

        if (data.permissions) {
            for (const permission of data.permissions) {
                if (Permission.toArray().indexOf(permission) < 0) {
                    throw new Error(__('role.permission_{{permission}}_not_found'));
                }
            }
        }

        try {
            await this.getOne({ slug: data.slug });
            throw new Error('role.role_existed');
            // tslint:disable-next-line: no-empty
        } catch (_) { }

        const newRole = new Role();
        newRole.name = data.name;
        newRole.slug = data.slug;
        newRole.description = data.description;
        newRole.level = data.level || 0;
        newRole.permissions = data.permissions;

        const role = await newRole.save({ reload: true });
        if (!role) { throw new Error(__('role.create_fail')); }

        return await this.getOne({ id: role.id });
    }

    public async edit(slug: string, data: {
        name?: string, description?: string, level?: number, permissions?: string[]
    }) {
        const role = await this.getOne({ slug });

        if (data.permissions) {
            for (const permission of data.permissions) {
                if (Permission.toArray().indexOf(permission) < 0) {
                    throw new Error(__('role.permission_{{permission}}_not_found'));
                }
            }
        }

        if (data.name) { role.name = data.name; }
        if (data.description) { role.description = data.description; }
        if (data.level) { role.level = data.level; }
        if (data.permissions) { role.permissions = data.permissions; }

        await role.save();

        return await this.getOne({ id: role.id });
    }

    public async delete(key: { slug?: string, id?: number }) {
        const role = await this.getOne(key);

        await role.remove();
    }

    public async getOne(key: { id?: number, slug?: string },
        options: { showPermissions: boolean } = { showPermissions: true }) {
        let role = null;

        if (key.id) {
            role = await Role.findOne({ where: { id: key.id } });
        } else if (key.slug) {
            role = await Role.findOne({ where: { slug: key.slug } });
        }

        if (!role) {
            throw new Error(__('role.role_not_found'));
        }

        if (!options.showPermissions) {
            delete role.permissions;
        }

        return role;
    }
}

const roleService = new RoleService();

export { roleService as RoleService };
