import { Router } from 'express';
import { StoreController } from '../controller/store.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, StoreController, {
    createMiddleware: AuthorMiddleware([Permission.store.create]),
    updateMiddleware: AuthorMiddleware([Permission.store.update]),
    deleteMiddleware: AuthorMiddleware([Permission.store.delete]),
});

export { router as StoreRouter };
