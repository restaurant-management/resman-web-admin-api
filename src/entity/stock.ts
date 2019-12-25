import { MaxLength } from 'class-validator';
import { Field, Float, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Stock extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @MaxLength(100)
    @Column({ length: 100 })
    public name: string;

    @Field(() => Float)
    @Column('float')
    public price: number;

    @Field()
    @MaxLength(20)
    @Column({ length: 20 })
    public unit: string;

    @Field()
    @Column('text', { nullable: true })
    public image: string;
}
