import { Router } from 'express';
import { ParamsDictionary, RequestHandlerParams } from 'express-serve-static-core';
import { ICrudController } from './ICrudController';

export interface CrudRouterOption {
    namespace?: string;
    middleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    listMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    createMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    readMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    updateMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    deleteMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
}

const crudRouter = (router: Router, controller: ICrudController, options: CrudRouterOption = {}) => {

    const namespace = options.namespace ? options.namespace : '';
    const middleware = options.middleware ? options.middleware : [];
    const listMiddleware = options.listMiddleware ? options.listMiddleware : [];
    const createMiddleware = options.createMiddleware ? options.createMiddleware : [];
    const readMiddleware = options.readMiddleware ? options.readMiddleware : [];
    const updateMiddleware = options.updateMiddleware ? options.updateMiddleware : [];
    const deleteMiddleware = options.deleteMiddleware ? options.deleteMiddleware : [];

    router.get(namespace + '/', ...middleware, ...listMiddleware, controller.list);
    router.post(namespace + '/create', ...middleware, ...createMiddleware, controller.create);
    router.get(namespace + '/:id', ...middleware, ...readMiddleware, controller.read);
    router.put(namespace + '/:id/update', ...middleware, ...updateMiddleware, controller.update);
    router.delete(namespace + '/:id/delete', ...middleware, ...deleteMiddleware, controller.delete);
};

export { crudRouter as CrudRouter };
