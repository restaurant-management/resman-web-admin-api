import { Router } from 'express';
import { CustomerController } from '../controller/customer.controller';

const router = Router();

router.get('/login', CustomerController.login);

export { router as CustomerRouter };
