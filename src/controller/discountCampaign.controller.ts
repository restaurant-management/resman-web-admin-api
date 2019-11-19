import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { DiscountCampaignService } from '../service/discountCampaign.service';

class DiscountCampaignController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DiscountCampaignService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        DiscountCampaignService.create(req.body)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DiscountCampaignService.getOne(parseInt(req.params.id, 10), req.query).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        DiscountCampaignService.edit(parseInt(req.params.id, 10), req.body).then(value =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        DiscountCampaignService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const discountCampaignController = new DiscountCampaignController();

export { discountCampaignController as DiscountCampaignController };
