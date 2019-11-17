import { Router } from 'express';
import { BillController } from '../controller/bill.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';
import { AuthorizationByRole } from '../middleware/authorizationByRole';

const router = Router();

CrudRouter(router, BillController, {
    listMiddleware: Authorization([Permission.bill.list]),
    readMiddleware: Authorization([Permission.bill.list]),
    createMiddleware: Authorization([Permission.bill.create]),
    updateMiddleware: Authorization([Permission.bill.update]),
    deleteMiddleware: Authorization([Permission.bill.delete])
});

// Security in controller
router.post('/restrict', AuthorizationByRole(['staff']), BillController.createWithRestrict);

// Select bill to prepare
router.put('/:id/prepare', AuthorizationByRole(['chef']), BillController.update);

// Mark all dishes are prepared
router.put('/:id/prepared', AuthorizationByRole(['chef']), BillController.update);
// Mark dish is prepared
router.put('/:id/prepared/:dishId', AuthorizationByRole(['chef']), BillController.update);

// Mark all dishes are delivered
router.put('/:id/delivered', AuthorizationByRole(['staff']), BillController.update);
// Mark dish is delivered
router.put('/:id/delivered/:dishId', AuthorizationByRole(['staff']), BillController.update);

// Collect bill
router.put('/:id/collect', AuthorizationByRole(['staff']), BillController.update);
// Change dishes in bill
router.put('/:id/change-dish', AuthorizationByRole(['staff']), BillController.update);

// Rating
router.put('/:id/rating', AuthorizationByRole(['staff']), BillController.update);

export { router as BillRouter };
