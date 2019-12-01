import { Router } from 'express';
import { VoucherCodeController } from '../controller/voucherCode.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, VoucherCodeController, {
    listMiddleware: AuthorMiddleware([Permission.voucherCode.list]),
    readMiddleware: AuthorMiddleware([Permission.voucherCode.list]),
    createMiddleware: AuthorMiddleware([Permission.voucherCode.create]),
    updateMiddleware: AuthorMiddleware([Permission.voucherCode.update]),
    deleteMiddleware: AuthorMiddleware([Permission.voucherCode.delete]),
});

export { router as VoucherCodeRouter };
