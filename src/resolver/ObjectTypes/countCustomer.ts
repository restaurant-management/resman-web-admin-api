import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CountCustomer {
    @Field()
    public day: Date;

    @Field(() => Int)
    public count: number;
}
