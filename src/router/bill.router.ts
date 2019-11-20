import { Router } from 'express';
import { BillController } from '../controller/bill.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';
import { AuthorizationByRole } from '../middleware/authorizationByRole';

const router = Router();

// Security in controller
router.post('/restrict', AuthorizationByRole(['staff']), BillController.createWithRestrict);

// Select bill to prepare
router.put('/:id/prepare', AuthorizationByRole(['chef']), BillController.prepare);

// Mark all dishes are prepared
router.put('/:id/prepared', AuthorizationByRole(['chef']), BillController.prepared);
// Mark dish is prepared
router.put('/:id/prepared/:dishId', AuthorizationByRole(['chef']), BillController.prepared);

// Mark all dishes are delivered
router.put('/:id/delivered', AuthorizationByRole(['staff']), BillController.delivered);
// Mark dish is delivered
router.put('/:id/delivered/:dishId', AuthorizationByRole(['staff']), BillController.delivered);

// Collect bill
router.put('/:id/collect', AuthorizationByRole(['staff']), BillController.collect);
// Change dishes in bill
router.put('/:id/change-dish', AuthorizationByRole(['staff']), BillController.changeDish);

// Assign customer
router.put('/:id/customer', AuthorizationByRole(['staff']), BillController.assignedCustomer);

// Rating
router.put('/:id/rating', AuthorizationByRole(['staff']), BillController.rating);

CrudRouter(router, BillController, {
    listMiddleware: Authorization([Permission.bill.list]),
    readMiddleware: Authorization([Permission.bill.list]),
    createMiddleware: Authorization([Permission.bill.create]),
    updateMiddleware: Authorization([Permission.bill.update]),
    deleteMiddleware: Authorization([Permission.bill.delete])
});

export { router as BillRouter };
