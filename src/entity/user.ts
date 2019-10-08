import { BaseEntity, Column, Entity, Generated, ManyToMany, PrimaryGeneratedColumn, JoinTable, OneToMany } from 'typeorm';
import { Role } from './role';
import { Store } from './store';
import { Warehouse } from './warehouse';
import { BillHistory } from './billHistory';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @Generated('uuid')
    public uuid: string;

    @Column({ unique: true })
    public userName: string;

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

    @ManyToMany(() => Role, { eager: true })
    @JoinTable()
    roles: Role[];

    @ManyToMany(() => Store)
    @JoinTable()
    stores: Store[];

    @ManyToMany(() => Warehouse)
    @JoinTable()
    warehouses: Warehouse[];

    @OneToMany(_type => BillHistory, history => history.user)
    public billHistories: BillHistory[];
}
