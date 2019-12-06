import { StoreService } from '../service/store.service';

/**
 * Please seed role and store before!
 */
export const seedStore = async () => {
    try {
        await StoreService.getOne(1);
    } catch (_) {
        await StoreService.create({
            name: 'Resman',
            address: 'HCM',
            hotline: '113',
            description: 'Resman',
            logo: 'https://avatars1.githubusercontent.com/u/36977998?s=460&v=4',
            openTime: new Date(1998, 1, 1, 6, 0),
            closeTime: new Date(1998, 1, 1, 16, 0)
        });
    }
};
