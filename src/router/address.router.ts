import { Router } from 'express';
import { AddressController } from '../controller/address.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, AddressController, {
    listMiddleware: Authorization([Permission.customer.list]),
    readMiddleware: Authorization([Permission.customer.list]),
    createMiddleware: Authorization([Permission.customer.create]),
    updateMiddleware: Authorization([Permission.customer.update]),
    deleteMiddleware: Authorization([Permission.customer.delete]),
});

export { router as AddressRouter };
