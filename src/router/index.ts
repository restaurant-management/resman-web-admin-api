import { Request, Response, Router } from 'express';
import { __ } from 'i18n';
import { CustomerRouter } from './customer.router';
import { StockRouter } from './stock.router';
import { StoreRouter } from './store.router';
import { UserRouter } from './user.router';
import { WarehouseRouter } from './warehouse.router';

const router = Router();

router.use('/users', UserRouter);
router.use('/customers', CustomerRouter);
router.use('/stores', StoreRouter);
router.use('/warehouses', WarehouseRouter);
router.use('/stocks', StockRouter);

router.get('/test', (_req: Request, res: Response) =>
    res.status(200).send({
        message: __('user_service.email_has_already_used')
    })
);

export default router;
