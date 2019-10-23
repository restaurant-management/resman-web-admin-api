import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

router.post('/login', UserController.login);

CrudRouter(router, UserController, {
    listMiddleware: Authorization([Permission.user.list]),
    readMiddleware: Authorization([Permission.user.list]),
    createMiddleware: Authorization([Permission.user.create]),
    updateMiddleware: Authorization([Permission.user.update]),
    deleteMiddleware: Authorization([Permission.user.delete]),
});

export { router as UserRouter };
