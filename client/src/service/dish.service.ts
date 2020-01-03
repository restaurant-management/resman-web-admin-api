import { Firebase } from '../lib/firebase';
import { GraphClient } from '../lib/graphClient';
import { DishQuery } from '../lib/graphQueries/dish.query';
import { Dish } from '../models/dish';

export class DishService {
    public static async getAll(token: string): Promise<Dish[]> {
        const data = await GraphClient.query({
            query: {
                query: DishQuery.dishes
            }, token
        });

        return data.dishes.map((e: any) => Dish.fromJson(e));
    }

    public static async get(token: string, id: number): Promise<Dish> {
        const data = await GraphClient.query({
            query: {
                query: DishQuery.getDish,
                variables: { id }
            }, token
        });

        return Dish.fromJson(data.getDish);
    }

    public static async create(token: string, dish: Dish) {
        const images: string[] = [];
        if (dish.uploadImages) {
            for (const [index, upload] of dish.uploadImages.entries()) {
                if (!upload.originFileObj) {
                    if (upload.url) {
                        images.push(upload.url);
                    }
                    continue;
                }
                images.push(await Firebase.uploadImage(
                    upload.originFileObj, dish.name + '-' + index, 'dishImages', false));
            }
        }
        delete dish.uploadImages;
        try {
            await GraphClient.mutation({
                mutation: {
                    mutation: DishQuery.createDish,
                    variables: {
                        ...dish,
                        images
                    }
                }, token
            });
        } catch (e) {
            // TODO delete images
            throw e;
        }
    }

    public static async edit(token: string, dish: Dish) {
        const images: string[] = [];
        if (dish.uploadImages) {
            for (const [index, upload] of dish.uploadImages.entries()) {
                if (!upload.originFileObj) {
                    if (upload.url) {
                        images.push(upload.url);
                    }
                    continue;
                }
                images.push(await Firebase.uploadImage(
                    upload.originFileObj, dish.name + '-' + index, 'dishImages', false));
            }
        }
        delete dish.uploadImages;
        await GraphClient.mutation({
            mutation: {
                mutation: DishQuery.editDish,
                variables: {
                    ...dish,
                    images
                }
            }, token
        });
    }

    public static async delete(token: string, id: number): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: DishQuery.deleteDish,
                variables: { id }
            }, token
        });

        return data ? data.deleteDish : '';
    }

    public static async deleteMany(token: string, ids: number[]): Promise<string> {
        const data = await GraphClient.mutation({
            mutation: {
                mutation: DishQuery.deleteDishes,
                variables: { ids }
            }, token
        });

        return data ? data.deleteDishes : '';
    }
}
