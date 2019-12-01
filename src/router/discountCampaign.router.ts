import { Router } from 'express';
import { DiscountCampaignController } from '../controller/discountCampaign.controller';
import { Permission } from '../entity/permission';
import { CrudRouter } from '../lib/crudRouter';
import { AuthorMiddleware } from '../middleware/authorization';

const router = Router();

CrudRouter(router, DiscountCampaignController, {
    listMiddleware: AuthorMiddleware([Permission.discountCampaign.list]),
    readMiddleware: AuthorMiddleware([Permission.discountCampaign.list]),
    createMiddleware: AuthorMiddleware([Permission.discountCampaign.create]),
    updateMiddleware: AuthorMiddleware([Permission.discountCampaign.update]),
    deleteMiddleware: AuthorMiddleware([Permission.discountCampaign.delete]),
});

export { router as DiscountCampaignRouter };
