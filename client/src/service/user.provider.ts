import { User } from '../models/user';

const login = async (usernameOrEmail: string, password: string): Promise<string> => {
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
};

const getAllUsers = async (token: string) => {
    const response = await fetch('/api/users', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': token
        },
    });

    if (response.ok) {
        return (await response.json()).map((item: any) => User.fromJson(item));
    } else {
        throw new Error((await response.json()).message);
    }
};

export { login, getAllUsers };
