import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { User } from '../entity/user';
import * as passwordHandler from '../helper/passwordHandler';

const userService = {
    authenticate: async (usernameOrEmail: string, password: string) => {
        let user = await getConnection()
            .createQueryBuilder()
            .select('user')
            .from(User, 'user')
            .where('user.username = :username', { username: usernameOrEmail })
            .addSelect('user.password')
            .getOne();

        if (!user) {
            user = await getConnection()
                .createQueryBuilder()
                .select('user')
                .from(User, 'user')
                .where('user.email = :email', { email: usernameOrEmail })
                .addSelect('user.password')
                .getOne();
        }

        if (user) {
            if (!passwordHandler.compare(password, user.password)) throw new Error('Password incorrect.');

            return jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET_KEY, { expiresIn: `${process.env.USER_TOKEN_EXPIRE_DAY || '1'} days` });
        }
        throw new Error('Username or email incorrect.');
    }
};

export { userService as UserService };
