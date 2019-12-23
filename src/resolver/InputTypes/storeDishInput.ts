import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class StoreDishInput {
    @Field(() => Int, { nullable: true })
    public dishId: number;

    @Field({nullable: true})
    public price?: number;
}
