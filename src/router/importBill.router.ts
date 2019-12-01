import { Router } from 'express';
import { ImportBillController } from '../controller/importBill.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, ImportBillController, {
    listMiddleware: AuthorMiddleware([Permission.store.list]),
    readMiddleware: AuthorMiddleware([Permission.store.list]),
    createMiddleware: AuthorMiddleware([Permission.store.create]),
    updateMiddleware: AuthorMiddleware([Permission.store.update]),
    deleteMiddleware: AuthorMiddleware([Permission.store.delete]),
});

export { router as ImportBillRouter };
