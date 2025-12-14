import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Board } from './board.entity';
import { Card } from './card.entity';

@Entity('class_services')
export class ClassService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'board_id' })
  boardId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @ManyToOne(() => Board, (board) => board.classServices)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Card, (card) => card.classService)
  cards: Card[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
