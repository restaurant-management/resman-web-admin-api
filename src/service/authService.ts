import { __ } from 'i18n';
import jwt from 'jsonwebtoken';
import { Customer } from '../entity/customer';
import { User } from '../entity/user';
import { CustomerService } from './customer.service';
import { UserService } from './user.service';

interface TokenPayload {
    uuid: string;
    type: 'user' | 'customer';
}

class AuthService {
    public sign(user: User | Customer): string {
        const payload: TokenPayload = {
            uuid: user.uuid,
            type: user instanceof User ? 'user' : 'customer'
        };

        return jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: `${process.env.USER_TOKEN_EXPIRE_DAY || '1'} days`
            }
        );
    }

    public async verify(token: string): Promise<User | Customer> {
        if (!token) {
            throw new Error(__('authentication.no_token_provided'));
        }

        let decoded = {};
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (e) {
            console.error(e);
            throw new Error(__('authentication.fail_authenticate_token'));
        }

        const payload: TokenPayload = (typeof decoded === 'string') ? JSON.parse(decoded) : decoded;

        if (payload.type === 'user') {
            return await UserService.getOne({ uuid: payload.uuid },
                { withRoles: true, withStores: true, withWarehouses: true });
        } else if (payload.type === 'customer') {
            return await CustomerService.getOne({ uuid: payload.uuid },
                { withAddresses: true, withFavouriteDishes: true });
        }

        throw new Error(__('authentication.fail_authenticate_token'));
    }
}

const authService = new AuthService();

export { authService as AuthService };
