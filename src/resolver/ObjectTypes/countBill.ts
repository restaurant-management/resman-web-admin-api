import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CountBill {
    @Field()
    public day: Date;

    @Field(() => Int)
    public count: number;

    @Field(() => Int)
    public countD: number;
}
