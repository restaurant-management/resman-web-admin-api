import { Firebase } from '../lib/firebase';
import { GraphClient } from '../lib/graphClient';
import { CustomerQuery } from '../lib/graphQueries/customer.query';
import { Customer } from '../models/customer';

export class CustomerService {
    public static async getAllCustomers(token: string): Promise<Customer[]> {
        const data = await GraphClient.query({
            query: {
                query: CustomerQuery.customers
            }, token
        });

        return data.customers.map((e: any) => Customer.fromJson(e));
    }

    public static async getCustomer(token: string, username: string): Promise<Customer> {
        const data = await GraphClient.query({
            query: {
                query: CustomerQuery.getCustomer,
                variables: { username }
            }, token
        });

        return Customer.fromJson(data.getCustomer);
    }

    public static async createCustomer(token: string, customer: Customer) {
        let avatarUrl = '';
        if (customer.avatarFile) {
            avatarUrl = await Firebase.uploadImage(customer.avatarFile, customer.username);
        }

        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: CustomerQuery.createCustomer,
                    variables: {
                        ...customer,
                        avatar: avatarUrl,
                        birthday: customer.birthday ? customer.birthday.toJSON() : undefined
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

    public static async editCustomer(token: string, customer: Customer) {
        let avatarUrl = '';
        if (customer.avatarFile && !customer.avatar) {
            avatarUrl = await Firebase.uploadImage(customer.avatarFile, customer.username);
        }

        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: CustomerQuery.editCustomer,
                    variables: {
                        ...customer,
                        avatar: avatarUrl || customer.avatar,
                        birthday: customer.birthday ? customer.birthday.toJSON() : undefined
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

    public static async deleteCustomer(token: string, username: string): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: CustomerQuery.deleteCustomer,
                variables: { username }
            }, token
        });

        return data ? data.deleteCustomer : '';
    }

    public static async deleteCustomers(token: string, usernames: string[]): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: CustomerQuery.deleteCustomers,
                variables: { usernames }
            }, token
        });

        return data ? data.deleteCustomers : '';
    }
}
