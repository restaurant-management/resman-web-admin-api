import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ImportBillStock } from './importBillStock';
import { User } from './user';

@Entity()
export class ImportBill extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ nullable: true })
    public note: string;

    @CreateDateColumn()
    public createAt: Date;

    @UpdateDateColumn()
    public updateAt: Date;

    @OneToMany(() => ImportBillStock, stock => stock.importBill, { nullable: false })
    public stocks: ImportBillStock[];

    @ManyToOne(() => User, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'userId' })
    public user: User;
}
