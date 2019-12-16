import { CustomerResolver } from './customer.resolver';
import { DailyDishResolver } from './dailyDish.resolver';
import { StoreResolver } from './store.resolver';
import { UserResolver } from './user.resolver';
import { WarehouseResolver } from './warehouse.resolver';

export const resolvers = [
    UserResolver, CustomerResolver, StoreResolver, DailyDishResolver, WarehouseResolver
];
