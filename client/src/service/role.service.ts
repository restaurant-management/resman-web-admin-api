import { GraphClient } from '../lib/graphClient';
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
}
