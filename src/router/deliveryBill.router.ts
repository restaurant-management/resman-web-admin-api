import { Router } from 'express';
import { DeliveryBillController } from '../controller/deliveryBill.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';
import { AuthorizationByRole } from '../middleware/authorizationByRole';
import { CustomerAuth } from '../middleware/customerAuth';

const router = Router();

// Create delivery bill router just for customer.
router.post('/restrict', CustomerAuth, DeliveryBillController.createWithRestrict);

// Select bill to prepare
router.put('/:id/prepare', AuthorizationByRole(['chef']), DeliveryBillController.prepare);

// Mark bill prepared
router.put('/:id/prepared', AuthorizationByRole(['chef']), DeliveryBillController.prepared);

// Mark bill is shipped
router.put('/:id/ship', AuthorizationByRole(['shipper']), DeliveryBillController.ship);

// Collect bill
router.put('/:id/collect', AuthorizationByRole(['shipper']), DeliveryBillController.collect);

// Rating
router.put('/:id/rating', CustomerAuth, DeliveryBillController.rating);

CrudRouter(router, DeliveryBillController, {
    listMiddleware: AuthorMiddleware([Permission.deliveryBill.list]),
    readMiddleware: AuthorMiddleware([Permission.deliveryBill.list]),
    createMiddleware: AuthorMiddleware([Permission.deliveryBill.create]),
    updateMiddleware: AuthorMiddleware([Permission.deliveryBill.update]),
    deleteMiddleware: AuthorMiddleware([Permission.deliveryBill.delete])
});

export { router as DeliveryBillRouter };
