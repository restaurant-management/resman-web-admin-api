import { NextFunction, Request, Response } from 'express';
import { ICrudController } from '../lib/ICrudController';
import { DailyReportService } from '../service/dailyReport.service';

class DailyReportController implements ICrudController {
    public async list(req: Request, res: Response, next: NextFunction) {
        DailyReportService.getAll(req.query.length, req.query.page, req.query.orderId, req.query.order).then(value => {
            return res.status(200).json(value);
        }).catch(e => next(e));
    }

    public create(req: Request, res: Response, next: NextFunction): void {
        DailyReportService.create(req.body.stockIds, req.body.quantities, req.body.warehouseId, req.body.username,
            req.body.note, req.body.stockPrices, req.body.stockNotes)
            .then(value => {
                return res.status(200).json(value);
            }).catch(e => next(e));
    }

    public read(req: Request, res: Response, next: NextFunction): void {
        DailyReportService.getOne(parseInt(req.params.id, 10)).then((value) =>
            res.status(200).json(value)
        ).catch(e => next(e));
    }

    public update(req: Request, res: Response, next: NextFunction): void {
        DailyReportService.edit(parseInt(req.params.id, 10), req.body.username, req.body.note)
            .then(value =>
                res.status(200).json(value)
            ).catch(e => next(e));
    }

    public delete(req: Request, res: Response, next: NextFunction): void {
        DailyReportService.delete(parseInt(req.params.id, 10)).then(() =>
            res.sendStatus(200)
        ).catch(e => next(e));
    }
}

const dailyReportController = new DailyReportController();

export { dailyReportController as DailyReportController };
