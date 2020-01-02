import moment from 'moment';
import { Firebase } from '../lib/firebase';
import { GraphClient } from '../lib/graphClient';
import { StoreQuery } from '../lib/graphQueries/store.query';
import { GraphQuery } from '../lib/graphQuery';
import { Store } from '../models/store';

export class StoreService {
    public static async getAll(): Promise<Store[]> {
        const data = await GraphClient.query({
            query: {
                query: GraphQuery.stores
            }
        });

        return data.stores.map((e: any) => Store.fromJson(e));
    }

    public static async get(token: string, id: number): Promise<Store> {
        const data = await GraphClient.query({
            query: {
                query: StoreQuery.getStore,
                variables: { id }
            }, token
        });

        return Store.fromJson(data.getStore);
    }

    public static async create(token: string, store: Store) {
        let logoUrl = '';
        if (store.logoFile) {
            logoUrl = await Firebase.uploadImage(store.logoFile, store.name.toString(), 'store');
        }

        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: StoreQuery.createStore,
                    variables: {
                        ...store,
                        logo: logoUrl,
                        closeTime: store.closeTime ? moment(store.closeTime).format('HH:mm:ss') : undefined,
                        openTime: store.openTime ? moment(store.openTime).format('HH:mm:ss') : undefined,
                    }
                }, token
            });
        } catch (e) {
            if (logoUrl) {
                try {
                    await Firebase.deleteImage(logoUrl);
                } catch (e) {
                    throw e.message;
                }
            }
            throw e;
        }

    }

    public static async edit(token: string, store: Store) {
        let logoUrl = '';
        if (store.logoFile && !store.logo) {
            logoUrl = await Firebase.uploadImage(store.logoFile, store.name.toString(), 'store');
        }

        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: StoreQuery.editStore,
                    variables: {
                        ...store,
                        logo: logoUrl || store.logo,
                        closeTime: store.closeTime ? moment(store.closeTime).format('HH:mm:ss') : undefined,
                        openTime: store.openTime ? moment(store.openTime).format('HH:mm:ss') : undefined,
                    }
                }, token
            });
        } catch (e) {
            if (logoUrl) {
                try {
                    await Firebase.deleteImage(logoUrl);
                } catch (e) {
                    throw e.message;
                }
            }
            throw e;
        }
    }

    public static async delete(token: string, id: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: StoreQuery.deleteStore,
                variables: { id }
            }, token
        });

        return data ? data.deleteStore : '';
    }
}
