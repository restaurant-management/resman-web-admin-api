import { CustomerResolver } from './customer.resolver';
import { DailyDishResolver } from './dailyDish.resolver';
import { DailyReportResolver } from './dailyReport.resolver';
import { DiscountCodeResolver } from './discountCode.resolver';
import { DishResolver } from './dish.resolver';
import { ImportBillResolver } from './importBill.resolver';
import { RoleResolver } from './role.resolver';
import { StoreResolver } from './store.resolver';
import { UserResolver } from './user.resolver';
import { WarehouseResolver } from './warehouse.resolver';

export const resolvers = [
    UserResolver,
    CustomerResolver,
    StoreResolver,
    DailyDishResolver,
    WarehouseResolver,
    ImportBillResolver,
    DailyReportResolver,
    RoleResolver,
    DishResolver,
    DiscountCodeResolver
];
