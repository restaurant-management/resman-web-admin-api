import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Dish extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100 })
    public name: string;

    @Column({ nullable: true })
    public description: string;

    @Column('text', { array: true })
    public images: string[];

    @Column('float', { default: 0 })
    public defaultPrice: number;
}
