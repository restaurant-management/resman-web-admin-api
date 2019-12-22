import { __ } from 'i18n';
import { Address } from '../entity/address';
import { CustomerService } from './customer.service';

class AddressService {
    public async getAll(customerUsername: string,
        options?: { length?: number, page?: number, orderId?: string, orderType?: 'ASC' | 'DESC' | '1' | '-1' }) {

        const customer = await CustomerService.getOne({ username: customerUsername });

        const order = options?.orderId
            ? { [options?.orderId]: options?.orderType === 'DESC' || options?.orderType === '-1' ? -1 : 1 }
            : {};
        const skip = (options?.page - 1) * options?.length >= 0 ? (options?.page - 1) * options?.length : 0;
        const take = options?.length;

        const address = await Address.find({ take, skip, order, where: { customerId: customer.id } });

        return address;
    }

    public async create(customerUsername: string,
        data: { address: string, longitude?: number, latitude?: number }) {
            console.log(data);
        const newAddress = new Address();
        newAddress.address = data.address;
        newAddress.customer = await CustomerService.getOne({ username: customerUsername });
        newAddress.longitude = data.longitude;
        newAddress.latitude = data.latitude;

        const address = await newAddress.save({ reload: true });
        if (!address) { throw new Error(__('address.create_fail')); }

        return address;
    }

    public async edit(customerUsername: string, id: number,
        data: { address?: string, longitude?: number, latitude?: number }) {

        if (data === {}) { return; }
        await CustomerService.getOne({ username: customerUsername });

        const address = await Address.findOne(id);

        if (data.address) { address.address = data.address; }
        if (data.longitude) { address.longitude = data.longitude; }
        if (data.latitude) { address.latitude = data.latitude; }

        await address.save();

        return await this.getOne(customerUsername, id, { withCustomer: true });
    }

    public async delete(customerUsername: string, id: number) {

        await CustomerService.getOne({ username: customerUsername });

        const address = await Address.findOne(id);

        if (!address) {
            throw new Error(__('address.address_not_found'));
        }

        await address.remove();
    }

    public async getOne(customerUsername: string, id: number, options?: { withCustomer?: boolean }) {

        await CustomerService.getOne({ username: customerUsername });

        const relations = [];
        if (options?.withCustomer) {
            relations.push('customer');
        }

        const address = await Address.findOne(id, { relations });

        if (!address) {
            throw new Error(__('address.address_not_found'));
        }

        return address;
    }
}

const addressService = new AddressService();

export { addressService as AddressService };
