import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stock extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ length: 100 })
    public name: string;

    @Column('float')
    public price: number;

    @Column({ length: 20 })
    public unit: string;

    @Column('text', { nullable: true })
    public image: string;
}
