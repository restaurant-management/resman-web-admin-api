import { Router } from 'express';
import { RoleController } from '../controller/role.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, RoleController, {
    listMiddleware: Authorization([Permission.role.list]),
    readMiddleware: Authorization([Permission.role.list]),
    createMiddleware: Authorization([Permission.role.create]),
    updateMiddleware: Authorization([Permission.role.update]),
    deleteMiddleware: Authorization([Permission.role.delete]),
});

export { router as RoleRouter };
