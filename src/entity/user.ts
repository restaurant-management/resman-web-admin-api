import { GraphQLScalarType, Kind } from 'graphql';
import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillHistory } from './billHistory';
import { Role } from './role';
import { Store } from './store';
import { Warehouse } from './warehouse';

// tslint:disable-next-line: variable-name
export const SettingsScalar = new GraphQLScalarType({
    name: 'UserSettings',
    description: 'User Settings',
    parseValue(value: string) {
        return JSON.parse(value);
    },
    serialize(value: object) {
        return JSON.stringify(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return JSON.parse(ast.value);
        }

        return null;
    }
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    @Generated('uuid')
    public uuid: string;

    @Field()
    @Column({ unique: true })
    public username: string;

    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    public fullName: string;

    @Field()
    @Column({ unique: true })
    public email: string;

    @Column({ select: false })
    public password: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    public avatar: string;

    @Field({ nullable: true })
    @Column('date', { nullable: true })
    public birthday: Date;

    @Field()
    @Column({ length: 20, unique: true })
    public phoneNumber: string;

    @Field({ nullable: true })
    @Column({ length: 200 })
    public address: string;

    @Field(() => SettingsScalar)
    @Column('json', { default: {} })
    public settings: object;

    @Field(() => [Role], { nullable: true })
    @ManyToMany(_type => Role)
    @JoinTable()
    public roles: Role[];

    @Field(() => [Store], { nullable: true })
    @ManyToMany(_type => Store, store => store.users, { onDelete: 'CASCADE' })
    @JoinTable()
    public stores: Store[];

    @ManyToMany(_type => Warehouse)
    @JoinTable()
    public warehouses: Warehouse[];

    @OneToMany(_type => BillHistory, history => history.user)
    public billHistories: BillHistory[];
}
