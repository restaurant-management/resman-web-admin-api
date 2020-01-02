import { GraphClient } from '../lib/graphClient';
import { RoleQuery } from '../lib/graphQueries/role.query';
import { GraphQuery } from '../lib/graphQuery';
import { Role } from '../models/role';

export class RoleService {
    public static async getAll(token: string): Promise<Role[]> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.roles
            }, token
        });

        return data.roles.map((e: any) => Role.fromJson(e));
    }

    public static async get(token: string, slug: string): Promise<Role> {
        const data = await GraphClient.query({
            query: {
                query: RoleQuery.getRole,
                variables: { slug }
            }, token
        });

        return Role.fromJson(data.getRole);
    }

    public static async create(token: string, role: Role) {
        await GraphClient.mutation({
            mutation: {
                mutation: RoleQuery.createRole,
                variables: {
                    ...role
                }
            }, token
        });
    }

    public static async edit(token: string, role: Role) {
        await GraphClient.mutation({
            mutation: {
                mutation: RoleQuery.editRole,
                variables: {
                    ...role
                }
            }, token
        });
    }

    public static async delete(token: string, slug: string): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: RoleQuery.deleteRole,
                variables: { slug }
            }, token
        });

        return data ? data.deleteRole : '';
    }

    public static async deleteMany(token: string, slugs: string[]): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: RoleQuery.deleteRoles,
                variables: { slugs }
            }, token
        });

        return data ? data.deleteRoles : '';
    }
}
