import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';
import { UserAuth } from '../middleware/userAuth';

const router = Router();

router.post('/login', UserController.login);

CrudRouter(router, UserController, {
    listMiddleware: AuthorMiddleware([Permission.user.list]),
    createMiddleware: AuthorMiddleware([Permission.user.create]),
    updateMiddleware: [UserAuth],
    deleteMiddleware: AuthorMiddleware([Permission.user.delete]),
    ignore: ['read']
});

// Authorization in controller to check if user is owner
router.get('/:username', UserAuth, UserController.getByUsername);
router.get('/email/:email', UserAuth, UserController.getByEmail);
router.patch('/password', UserAuth, UserController.changePassword);

export { router as UserRouter };
