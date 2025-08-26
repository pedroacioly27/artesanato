import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";

@Entity("records")
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  total: number;

  @ManyToOne(() => User, (user) => user.records)
  @JoinColumn({ name: "user_id" })
  user: User;
}
