import { Request, Response, Router } from 'express';
import { CustomerRouter } from './customer.router';
import { UserRouter } from './user.router';

const router = Router();

router.use('/users', UserRouter);
router.use('/customers', CustomerRouter);

router.get('/test', (req: Request, res: Response) =>
    res.status(200).send({
        message: req.t('user_service.email_has_already_used')
    })
);

export default router;
