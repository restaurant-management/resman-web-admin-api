import { __ } from 'i18n';
import { Address } from '../entity/address';
import { CustomerService } from './customer.service';

class AddressService {
    public async getAll(options?: { length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' }) {
        const order = options?.orderId
            ? { [options?.orderId]: options?.orderType === 'DESC' || options?.orderType === '-1' ? -1 : 1 }
            : {};
        const skip = (options?.page - 1) * options?.length >= 0 ? (options?.page - 1) * options?.length : 0;
        const take = options?.length;

        const address = await Address.find({ take, skip, order });

        return address;
    }

    public async create(data: { address: string, longitude?: number, latitude?: number, customerUuid: string }) {
        const newAddress = new Address();
        newAddress.address = data.address;
        newAddress.customer = await CustomerService.getOne({ uuid: data.customerUuid });
        newAddress.longitude = data.longitude;
        newAddress.latitude = data.latitude;

        const address = await newAddress.save({ reload: true });
        if (!address) { throw new Error(__('address.create_fail')); }

        return address;
    }

    public async edit(id: number,
        data: { address?: string, longitude?: number, latitude?: number, customerUuid?: string }) {
        if (data === {}) { return; }
        const address = await Address.findOne(id);

        if (data.address) { address.address = data.address; }
        if (data.longitude) { address.longitude = data.longitude; }
        if (data.latitude) { address.latitude = data.latitude; }
        if (data.customerUuid) { address.customer = await CustomerService.getOne({ uuid: data.customerUuid }); }

        return await address.save();
    }

    public async delete(id: number) {
        const address = await Address.findOne(id);

        if (!address) {
            throw new Error(__('address.address_not_found'));
        }

        await address.remove();
    }

    public async getOne(id: number) {
        const address = await Address.findOne(id);

        if (!address) {
            throw new Error(__('address.address_not_found'));
        }

        return address;
    }
}

const addressService = new AddressService();

export { addressService as AddressService };
