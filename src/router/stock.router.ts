import { Router } from 'express';
import { StockController } from '../controller/stock.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, StockController, {
    listMiddleware: Authorization([Permission.store.list]),
    readMiddleware: Authorization([Permission.store.list]),
    createMiddleware: Authorization([Permission.store.create]),
    updateMiddleware: Authorization([Permission.store.update]),
    deleteMiddleware: Authorization([Permission.store.delete]),
});

export { router as StockRouter };
