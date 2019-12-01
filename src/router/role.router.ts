import { Router } from 'express';
import { RoleController } from '../controller/role.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, RoleController, {
    listMiddleware: AuthorMiddleware([Permission.role.list]),
    readMiddleware: AuthorMiddleware([Permission.role.list]),
    createMiddleware: AuthorMiddleware([Permission.role.create]),
    updateMiddleware: AuthorMiddleware([Permission.role.update]),
    deleteMiddleware: AuthorMiddleware([Permission.role.delete]),
});

export { router as RoleRouter };
