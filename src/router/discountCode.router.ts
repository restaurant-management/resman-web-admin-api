import { Router } from 'express';
import { DiscountCodeController } from '../controller/discountCode.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DiscountCodeController, {
    listMiddleware: Authorization([Permission.discountCode.list]),
    readMiddleware: Authorization([Permission.discountCode.list]),
    createMiddleware: Authorization([Permission.discountCode.create]),
    updateMiddleware: Authorization([Permission.discountCode.update]),
    deleteMiddleware: Authorization([Permission.discountCode.delete]),
});

export { router as DiscountCodeRouter };
