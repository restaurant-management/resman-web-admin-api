import { GraphQLScalarType, Kind } from 'graphql';
import moment from 'moment';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Dish } from './dish';
import { Store } from './store';
import { User } from './user';

export enum DaySession {
    None = 'none',
    Morning = 'morning',
    Noon = 'noon',
    Afternoon = 'afternoon',
    Evening = 'evening'
}

export const dateScalar = new GraphQLScalarType({
    name: 'date',
    description: 'Date use for daily dish',
    parseValue(value: Date) {
        return value;
    },
    serialize(value: string) {
        return moment(value, 'YYYY-MM-DD').format('YYYY-MM-DD');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }

        return null;
    }
});

registerEnumType(DaySession, {
    name: 'DaySession',
    description: 'Day session use for daily dish'
});

@ObjectType()
@Entity()
export class DailyDish extends BaseEntity {
    @Field(() => dateScalar)
    @PrimaryColumn('date')
    public day: Date;

    @Field(() => String)
    @PrimaryColumn({
        type: 'enum',
        enum: Object.keys(DaySession).map(value => DaySession[value]),
        default: DaySession.None
    })
    public session: DaySession;

    @Field(() => Store, { nullable: true })
    @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;

    @Field()
    @PrimaryColumn()
    public storeId: number;

    @Field(() => Dish)
    @ManyToOne(() => Dish, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'dishId' })
    public dish: Dish;

    @Field()
    @PrimaryColumn()
    public dishId: number;

    @ManyToOne(() => User, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'confirmById' })
    public confirmBy: User;

    @Column('timestamp with time zone', { nullable: true })
    public confirmAt: Date;
}
