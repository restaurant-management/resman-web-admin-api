import { Router } from 'express';
import { AddressController } from '../controller/address.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, AddressController, {
    listMiddleware: AuthorMiddleware([Permission.customer.list]),
    readMiddleware: AuthorMiddleware([Permission.customer.list]),
    createMiddleware: AuthorMiddleware([Permission.customer.create]),
    updateMiddleware: AuthorMiddleware([Permission.customer.update]),
    deleteMiddleware: AuthorMiddleware([Permission.customer.delete]),
});

export { router as AddressRouter };
