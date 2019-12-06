import { Router } from 'express';
import { AddressController } from '../controller/address.controller';
import { CustomerController } from '../controller/customer.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { SubCrudRouter } from '../lib/subCrudRouter';
import { AuthorMiddleware } from '../middleware/authorization';
import { CustomerAuth } from '../middleware/customerAuth';

const router = Router();

router.post('/login', CustomerController.login);
router.post('/register', CustomerController.create);
router.patch('/password', CustomerAuth, CustomerController.changePassword);

SubCrudRouter(router, AddressController, {
    parentIdString: 'customerUsername',
    namespace: 'addresses',
    listMiddleware: AuthorMiddleware([Permission.customer.list]),
    readMiddleware: AuthorMiddleware([Permission.customer.list]),
    createMiddleware: AuthorMiddleware([Permission.customer.create]),
    updateMiddleware: AuthorMiddleware([Permission.customer.update]),
    deleteMiddleware: AuthorMiddleware([Permission.customer.delete]),
});

CrudRouter(router, CustomerController, {
    listMiddleware: AuthorMiddleware([Permission.customer.list]),
    readMiddleware: AuthorMiddleware([Permission.customer.list]),
    createMiddleware: AuthorMiddleware([Permission.customer.create]),
    updateMiddleware: AuthorMiddleware([Permission.customer.update]),
    deleteMiddleware: AuthorMiddleware([Permission.customer.delete]),
});

export { router as CustomerRouter };
