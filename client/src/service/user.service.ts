import { Firebase } from '../lib/firebase';
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

    public static async me(token: string): Promise<User> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.meAsUser
            }, token
        });

        return User.fromJson(data.meAsUser);
    }

    public static async getAllUsers(token: string): Promise<User[]> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.users
            }, token
        });

        return data.users.map((e: any) => User.fromJson(e));
    }

    public static async getAllByRole(token: string, roleSlugs: string[]): Promise<User[]> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.usersByRole,
                variables: { roleSlugs }
            }, token
        });

        return data.usersByRole.map((e: any) => User.fromJson(e));
    }

    public static async getUser(token: string, username: string): Promise<User> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.getUser,
                variables: { username }
            }, token
        });

        return User.fromJson(data.getUser);
    }

    public static async createUser(token: string, user: User) {
        let avatarUrl = '';
        if (user.avatarFile) {
            avatarUrl = await Firebase.uploadImage(user.avatarFile, user.username);
        }

        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: GraphQuery.createUser,
                    variables: {
                        ...user,
                        avatar: avatarUrl,
                        birthday: user.birthday ? user.birthday.toJSON() : undefined
                    }
                }, token
            });
        } catch (e) {
            if (avatarUrl) {
                try {
                    await Firebase.deleteImage(avatarUrl);
                } catch (e) {
                    throw e.message;
                }
            }
            throw e;
        }

    }

    public static async editUser(token: string, user: User) {
        let avatarUrl = '';
        if (user.avatarFile && !user.avatar) {
            avatarUrl = await Firebase.uploadImage(user.avatarFile, user.username);
        }

        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: GraphQuery.editUser,
                    variables: {
                        ...user,
                        avatar: avatarUrl || user.avatar,
                        birthday: user.birthday ? user.birthday.toJSON() : undefined
                    }
                }, token
            });
        } catch (e) {
            if (avatarUrl) {
                try {
                    await Firebase.deleteImage(avatarUrl);
                } catch (e) {
                    throw e.message;
                }
            }
            throw e;
        }
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

    public static async deleteUsers(token: string, usernames: string[]): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: GraphQuery.deleteUsers,
                variables: { usernames }
            }, token
        });

        return data ? data.deleteUsers : '';
    }
}
