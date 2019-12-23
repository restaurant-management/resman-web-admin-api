import { Field, ObjectType } from 'type-graphql';
import { Bill } from '../../entity/bill';
import { DeliveryBill } from '../../entity/deliveryBill';

@ObjectType()
export class AllBill {
    @Field(() => [Bill])
    public bills: Bill[];

    @Field(() => [DeliveryBill])
    public deliveryBills: DeliveryBill[];
}
