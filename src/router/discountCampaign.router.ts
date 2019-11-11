import { Router } from 'express';
import { DiscountCampaignController } from '../controller/discountCampaign.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { Authorization } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DiscountCampaignController, {
    listMiddleware: Authorization([Permission.discountCampaign.list]),
    readMiddleware: Authorization([Permission.discountCampaign.list]),
    createMiddleware: Authorization([Permission.discountCampaign.create]),
    updateMiddleware: Authorization([Permission.discountCampaign.update]),
    deleteMiddleware: Authorization([Permission.discountCampaign.delete]),
});

export { router as DiscountCampaignRouter };
