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
import { ColumnHistory } from './column-history.entity';

@Entity('columns')
export class BoardColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'board_id' })
  boardId: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  order: number;

  @ManyToOne(() => Board, (board) => board.columns)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];

  @OneToMany(() => ColumnHistory, (history) => history.fromColumn)
  fromHistories: ColumnHistory[];

  @OneToMany(() => ColumnHistory, (history) => history.toColumn)
  toHistories: ColumnHistory[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
