import { Router } from 'express';
import { DailyDishController } from '../controller/dailyDish.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DailyDishController, {
    listMiddleware: Authorization([Permission.dailyDish.list]),
    createMiddleware: Authorization([Permission.dailyDish.create]),
    ignore: ['read', 'update', 'delete']
});

router.get('/get_by', Authorization([Permission.dailyDish.list]), DailyDishController.read);
router.put('/', Authorization([Permission.dailyDish.update]), DailyDishController.update);
router.delete('/', Authorization([Permission.dailyDish.delete]), DailyDishController.delete);

export { router as DailyDishRouter };
