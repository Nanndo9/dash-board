import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Transaction } from "./Transactions";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar' })
    firstName: string;

    @Column({ type: 'varchar' })
    lastName: string;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar' })
    password: string;

    @OneToMany(() => Transaction, (transaction) => transaction.user)
    transactions: Transaction[];
}