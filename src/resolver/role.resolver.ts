import { __ } from 'i18n';
import { Arg, Authorized, ID, Int, Mutation, Query } from 'type-graphql';
import { Permission } from '../entity/permission';
import { Role } from '../entity/role';
import { RoleService } from '../service/role.service';

export class RoleResolver {
    @Query(() => [Role], { description: 'For admin' })
    @Authorized([Permission.role.list])
    public async roles() {
        return await RoleService.getAll({});
    }

    @Query(() => Role, { description: 'For admin' })
    @Authorized([Permission.role.list])
    public async getRole(
        @Arg('id', () => ID, { nullable: true }) id: number,
        @Arg('slug', { nullable: true }) slug: string
    ) {
        return await RoleService.getOne({ id, slug });
    }

    @Mutation(() => Role, { description: 'For admin' })
    @Authorized([Permission.role.create])
    public async createRole(
        @Arg('name') name: string,
        @Arg('slug', { nullable: true }) slug: string,
        @Arg('description', { nullable: true }) description: string,
        @Arg('level', () => Int, { nullable: true }) level: number,
        @Arg('permissions', () => [String], { nullable: true }) permissions: string[],
    ) {
        return await RoleService.create({ name, slug, description, level, permissions });
    }

    @Mutation(() => Role, { description: 'For admin' })
    @Authorized([Permission.role.update])
    public async editRole(
        @Arg('slug') slug: string,
        @Arg('name', { nullable: true }) name: string,
        @Arg('description', { nullable: true }) description: string,
        @Arg('level', () => Int, { nullable: true }) level: number,
        @Arg('permissions', () => [String], { nullable: true }) permissions: string[],
    ) {
        return await RoleService.edit(slug, { name, description, level, permissions });
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.role.delete])
    public async deleteRole(
        @Arg('id', () => ID, { nullable: true }) id: number,
        @Arg('slug', { nullable: true }) slug: string
    ) {
        await RoleService.delete({ id, slug });

        return __('role.delete_success');
    }

    @Mutation(() => String, { description: 'For admin' })
    @Authorized([Permission.role.delete])
    public async deleteRoles(
        @Arg('slugs', () => [String], { nullable: true }) slugs: string[]
    ) {
        await RoleService.multiDelete(slugs.map(e => ({slug: e})));

        return __('role.delete_success');
    }
}
