import { Router } from 'express';
import { AddressController } from '../controller/address.controller';
import { CustomerController } from '../controller/customer.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { SubCrudRouter } from '../lib/subCrudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

router.post('/login', CustomerController.login);

SubCrudRouter(router, AddressController, {
    parentIdString: 'customerUsername',
    namespace: 'addresses',
    listMiddleware: Authorization([Permission.customer.list]),
    readMiddleware: Authorization([Permission.customer.list]),
    createMiddleware: Authorization([Permission.customer.create]),
    updateMiddleware: Authorization([Permission.customer.update]),
    deleteMiddleware: Authorization([Permission.customer.delete]),
});

CrudRouter(router, CustomerController, {
    listMiddleware: Authorization([Permission.customer.list]),
    readMiddleware: Authorization([Permission.customer.list]),
    createMiddleware: Authorization([Permission.customer.create]),
    updateMiddleware: Authorization([Permission.customer.update]),
    deleteMiddleware: Authorization([Permission.customer.delete]),
});

export { router as CustomerRouter };
