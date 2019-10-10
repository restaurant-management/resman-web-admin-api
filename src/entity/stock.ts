import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Warehouse } from './warehouse';

@Entity()
export class Stock extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true, length: 100 })
    public name: string;

    @Column('money')
    public price: number;

    @Column({ length: 20 })
    public unit: string;

    @ManyToMany(() => Warehouse)
    public warehouses: Warehouse[];
}
