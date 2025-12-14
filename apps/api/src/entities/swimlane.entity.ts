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

@Entity('swimlanes')
export class Swimlane {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'board_id' })
  boardId: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  order: number;

  @ManyToOne(() => Board, (board) => board.swimlanes)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Card, (card) => card.swimlane)
  cards: Card[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
