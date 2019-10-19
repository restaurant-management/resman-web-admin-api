import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { CrudRouter } from '../lib/crudRouter';

const router = Router();

router.get('/login', UserController.login);

CrudRouter(router, UserController);

export { router as UserRouter };
