import { MaxLength } from 'class-validator';
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Dish extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @MaxLength(100)
    @Column({ length: 100 })
    public name: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public description: string;

    @Field(() => [String], { defaultValue: [] })
    @Column('text', { array: true })
    public images: string[];

    @Field({ defaultValue: 0 })
    @Column('float', { default: 0 })
    public defaultPrice: number;

    @Field({ defaultValue: 0 })
    public price: number;
}
