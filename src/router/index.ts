import { Request, Response, Router } from 'express';

const router = Router();

// TODO Add all api router here

router.get('/test', (_req: Request, res: Response) =>
    res.status(200).send({
        message: 'Welcome to ResMan'
    })
);

export default router;