import { Router } from 'express';
import { VoucherCodeController } from '../controller/voucherCode.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, VoucherCodeController, {
    listMiddleware: Authorization([Permission.voucherCode.list]),
    readMiddleware: Authorization([Permission.voucherCode.list]),
    createMiddleware: Authorization([Permission.voucherCode.create]),
    updateMiddleware: Authorization([Permission.voucherCode.update]),
    deleteMiddleware: Authorization([Permission.voucherCode.delete]),
});

export { router as VoucherCodeRouter };
