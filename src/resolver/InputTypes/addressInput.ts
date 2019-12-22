import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AddressInput {
    @Field(() => Int, { nullable: true })
    public id: number;

    @Field()
    public address: string;

    @Field({nullable: true})
    public longitude: number;

    @Field({nullable: true})
    public latitude: number;
}
