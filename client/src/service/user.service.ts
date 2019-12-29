import { GraphClient } from '../lib/graphClient';
import { GraphQuery } from '../lib/graphQuery';
import { User } from '../models/user';

export class UserService {
    public static async login(usernameOrEmail: string, password: string): Promise<string> {
        const response = await fetch('/api/users/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                usernameOrEmail, password
            })
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error((await response.json()).message);
        }
    }

    public static async getAllUsers(token: string): Promise<User[]> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.users
            }, token
        });

        return data.users.map((e: any) => User.fromJson(e));
    }

    public static async createUser(token: string, data: {
        address: string, email: string, password: string,
        username: string, storeIds: number[], roles?: string[], avatar?: string,
        birthday?: Date, fullName?: string, phoneNumber?: string
    }) {
        return User.fromJson(await GraphClient.mutation({
            mutation: {
                mutation: GraphQuery.createUser,
                variables: {
                    ...data,
                    birthday: data.birthday ? data.birthday.toJSON() : undefined
                }
            }, token
        }));
    }

    public static async deleteUser(token: string, username: string): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: GraphQuery.deleteUser,
                variables: { username }
            }, token
        });

        return data ? data.deleteUser : '';
    }
}
