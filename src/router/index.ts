import { Request, Response, Router } from 'express';
import { CustomerRouter } from './customer.router';
import { UserRouter } from './user.router';

const router = Router();

router.use('/users', UserRouter);
router.use('/customers', CustomerRouter);

router.get('/test', (_req: Request, res: Response) =>
    res.status(200).send({
        message: 'Welcome to ResMan'
    })
);

export default router;
