import { Router } from 'express';
import { ParamsDictionary, RequestHandlerParams } from 'express-serve-static-core';
import { ICrudController } from './ICrudController';

export interface CrudRouterOption {
    namespace?: string;
    middleware?: Array<RequestHandlerParams<ParamsDictionary>>;
}

const crudRouter = (router: Router, controller: ICrudController, options?: CrudRouterOption) => {
    const namespace = options ? options.namespace : '';
    const middleware = options ? options.middleware : [];

    router.get(namespace + '/', ...middleware, controller.list);
    router.post(namespace + '/create', ...middleware, controller.create);
    router.put(namespace + '/:id', ...middleware, controller.read);
    router.put(namespace + '/:id/update', ...middleware, controller.update);
    router.delete(namespace + '/:id/delete', ...middleware, controller.delete);
};

export { crudRouter as CrudRouter };
