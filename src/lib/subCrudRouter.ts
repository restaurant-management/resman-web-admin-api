import { Router } from 'express';
import { ParamsDictionary, RequestHandlerParams } from 'express-serve-static-core';
import { ICrudController } from './ICrudController';

export interface CrudRouterOption {
    parentIdString: string;
    namespace?: string;
    middleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    listMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    createMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    readMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    updateMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    deleteMiddleware?: Array<RequestHandlerParams<ParamsDictionary>>;
    ignore?: Array<'list' | 'create' | 'read' | 'update' | 'delete'>;
}

const subCrudRouter = (router: Router, controller: ICrudController, options: CrudRouterOption) => {

    const { parentIdString } = options;
    const namespace = options.namespace ? options.namespace + '/' : '';
    const middleware = options.middleware ? options.middleware : [];
    const listMiddleware = options.listMiddleware ? options.listMiddleware : [];
    const createMiddleware = options.createMiddleware ? options.createMiddleware : [];
    const readMiddleware = options.readMiddleware ? options.readMiddleware : [];
    const updateMiddleware = options.updateMiddleware ? options.updateMiddleware : [];
    const deleteMiddleware = options.deleteMiddleware ? options.deleteMiddleware : [];
    const ignore = options.ignore || [];

    if (ignore.findIndex(i => i === 'list') === -1) {
        router.get(`/:${parentIdString}/${namespace}`, ...middleware, ...listMiddleware, controller.list);
    }
    if (ignore.findIndex(i => i === 'create') === -1) {
        router.post(`/:${parentIdString}/${namespace}`, ...middleware, ...createMiddleware, controller.create);
    }
    if (ignore.findIndex(i => i === 'read') === -1) {
        router.get(`/:${parentIdString}/${namespace}:id`, ...middleware, ...readMiddleware, controller.read);
    }
    if (ignore.findIndex(i => i === 'update') === -1) {
        router.put(`/:${parentIdString}/${namespace}:id`, ...middleware, ...updateMiddleware, controller.update);
    }
    if (ignore.findIndex(i => i === 'delete') === -1) {
        router.delete(`/:${parentIdString}/${namespace}:id`, ...middleware, ...deleteMiddleware, controller.delete);
    }
};

export { subCrudRouter as SubCrudRouter };
