import { CustomerResolver } from './customer.resolver';
import { StoreResolver } from './store.resolver';
import { UserResolver } from './user.resolver';

export const resolvers = [
    UserResolver, CustomerResolver, StoreResolver
];
