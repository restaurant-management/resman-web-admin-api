import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../entity/user';

@Entity()
export class SoftDeleteEntity extends BaseEntity {
    @Column({ type: 'timestamp with time zone', nullable: true })
    public deleteAt: Date;

    @ManyToOne(_type => User, { nullable: true })
    public deleteBy: User;

    public async softDelete(user: User) {
        this.deleteAt = new Date();
        this.deleteBy = user;
        await this.save();
    }

    public async restore() {
        this.deleteAt = null;
        this.deleteBy = null;
        await this.save();
    }
}
