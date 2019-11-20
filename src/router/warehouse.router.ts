import { Router } from 'express';
import { WarehouseController } from '../controller/warehouse.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, WarehouseController, {
    listMiddleware: Authorization([Permission.store.list]),
    readMiddleware: Authorization([Permission.store.list]),
    createMiddleware: Authorization([Permission.store.create]),
    updateMiddleware: Authorization([Permission.store.update]),
    deleteMiddleware: Authorization([Permission.store.delete]),
});

export { router as WarehouseRouter };
