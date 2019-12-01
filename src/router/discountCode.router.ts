import { Router } from 'express';
import { DiscountCodeController } from '../controller/discountCode.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DiscountCodeController, {
    listMiddleware: AuthorMiddleware([Permission.discountCode.list]),
    readMiddleware: AuthorMiddleware([Permission.discountCode.list]),
    createMiddleware: AuthorMiddleware([Permission.discountCode.create]),
    updateMiddleware: AuthorMiddleware([Permission.discountCode.update]),
    deleteMiddleware: AuthorMiddleware([Permission.discountCode.delete]),
});

export { router as DiscountCodeRouter };
