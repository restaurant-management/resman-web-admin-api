import { Router } from 'express';
import { DailyDishController } from '../controller/dailyDish.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';
import { UserAuth } from '../middleware/userAuth';

const router = Router();

CrudRouter(router, DailyDishController, {
    listMiddleware: AuthorMiddleware([Permission.dailyDish.list]),
    createMiddleware: AuthorMiddleware([Permission.dailyDish.create]),
    ignore: ['read', 'delete', 'update']
});

router.put('/', AuthorMiddleware([Permission.dailyDish.update]), DailyDishController.update);
router.delete('/', AuthorMiddleware([Permission.dailyDish.delete]), DailyDishController.delete);

router.get('/get_by', UserAuth, DailyDishController.read);

// Public daily dish
router.get('/today', DailyDishController.listToday);

export { router as DailyDishRouter };
