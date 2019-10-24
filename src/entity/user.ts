import { BaseEntity, Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillHistory } from './billHistory';
import { Role } from './role';
import { Store } from './store';
import { Warehouse } from './warehouse';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Generated('uuid')
    public uuid: string;

    @Column({ unique: true })
    public username: string;

    @Column({ length: 100, nullable: true })
    public fullName: string;

    @Column({ unique: true })
    public email: string;

    @Column({ select: false })
    public password: string;

    @Column({ nullable: true })
    public avatar: string;

    @Column('date', { nullable: true })
    public birthday: Date;

    @Column({ length: 20, unique: true })
    public phoneNumber: string;

    @Column({ length: 200 })
    public address: string;

    @ManyToMany(_type => Role, { eager: true })
    @JoinTable()
    public roles: Role[];

    @ManyToMany(_type => Store, store => store.users, { onDelete: 'CASCADE' })
    @JoinTable()
    public stores: Store[];

    @ManyToMany(_type => Warehouse)
    @JoinTable()
    public warehouses: Warehouse[];

    @OneToMany(_type => BillHistory, history => history.user)
    public billHistories: BillHistory[];
}
