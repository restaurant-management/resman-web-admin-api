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

@Entity()
export class DailyDish extends BaseEntity {
    @PrimaryColumn('date')
    public day: Date;

    @PrimaryColumn({
        type: 'enum',
        enum: Object.keys(DaySession).map(value => DaySession[value]),
        default: DaySession.None
    })
    public session: DaySession;

    @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storeId' })
    public store: Store;

    @PrimaryColumn()
    public storeId: number;

    @ManyToOne(() => Dish, { nullable: false, onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'dishId' })
    public dish: Store;

    @PrimaryColumn()
    public dishId: number;

    @ManyToOne(() => User, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'confirmById' })
    public confirmBy: User;

    @Column('timestamp with time zone', { nullable: true })
    public confirmAt: Date;
}
