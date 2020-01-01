import { Request, Response, Router } from 'express';
import { __ } from 'i18n';
import { BillRouter } from './bill.router';
import { CustomerRouter } from './customer.router';
import { DailyDishRouter } from './dailyDish.router';
import { DailyReportRouter } from './dailyReport.router';
import { DeliveryBillRouter } from './deliveryBill.router';
import { DiscountCampaignRouter } from './discountCampaign.router';
import { DiscountCodeRouter } from './discountCode.router';
import { DishRouter } from './dish.router';
import { ImportBillRouter } from './importBill.router';
import { RoleRouter } from './role.router';
import { StockRouter } from './stock.router';
import { StoreRouter } from './store.router';
import { UserRouter } from './user.router';
import { VoucherCodeRouter } from './voucherCode.router';
import { WarehouseRouter } from './warehouse.router';

const router = Router();

router.use('/users', UserRouter);
router.use('/roles', RoleRouter);
router.use('/customers', CustomerRouter);
router.use('/stores', StoreRouter);
router.use('/warehouses', WarehouseRouter);
router.use('/stocks', StockRouter);
router.use('/import_bills', ImportBillRouter);
router.use('/daily_reports', DailyReportRouter);
router.use('/dishes', DishRouter);
router.use('/daily_dishes', DailyDishRouter);
router.use('/voucher_codes', VoucherCodeRouter);
router.use('/discount_codes', DiscountCodeRouter);
router.use('/discount_campaigns', DiscountCampaignRouter);
router.use('/bills', BillRouter);
router.use('/delivery_bills', DeliveryBillRouter);

router.get('/test', (_req: Request, res: Response) =>
    res.status(200).send({
        message: __('welcome_resman')
    })
);

export default router;
