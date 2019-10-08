import { Router } from 'express';
import { UserController } from '../controller/user.controller';

const router = Router();

router.get('/login', UserController.login);

export { router as UserRouter };
