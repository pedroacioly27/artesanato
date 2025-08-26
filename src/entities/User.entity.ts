import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "./Transaction.entity";
import { Order } from "./Order.entity";
import { Record } from "./Record.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Transaction, (transactions) => transactions.user)
  transactions: Transaction;

  @OneToMany(() => Order, (orders) => orders.user)
  orders: Order;

  @OneToMany(() => Record, (records) => records.user)
  records: Record;
}
