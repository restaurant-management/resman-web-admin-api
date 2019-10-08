import bcrypt from 'bcryptjs';

const passwordHandler = {
    encode: (password: string): string => {
        return bcrypt.hashSync(password, 8);
    },

    compare: (password: string, encodePassword: string): boolean => {
        return bcrypt.compareSync(password, encodePassword);
    }
};

export { passwordHandler as PasswordHandler };
