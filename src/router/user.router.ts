import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

router.post('/login', UserController.login);

CrudRouter(router, UserController, {
    listMiddleware: Authorization([Permission.user.list]),
    createMiddleware: Authorization([Permission.user.create]),
    updateMiddleware: Authorization([Permission.user.update]),
    deleteMiddleware: Authorization([Permission.user.delete]),
    ignore: ['read']
});

router.get('/:username', Authorization([Permission.user.list]), UserController.getByUsername);
router.get('/email/:email', Authorization([Permission.user.list]), UserController.getByEmail);

export { router as UserRouter };
