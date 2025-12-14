import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Card } from './card.entity';
import { BoardColumn } from './column.entity';
import { User } from './user.entity';

@Entity('column_history')
export class ColumnHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'card_id' })
  cardId: string;

  @Column({ name: 'from_column_id', nullable: true })
  fromColumnId: string;

  @Column({ name: 'to_column_id' })
  toColumnId: string;

  @Column({ name: 'moved_by', nullable: true })
  movedBy: string;

  @ManyToOne(() => Card, (card) => card.histories)
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @ManyToOne(() => BoardColumn, (column) => column.fromHistories, {
    nullable: true,
  })
  @JoinColumn({ name: 'from_column_id' })
  fromColumn: BoardColumn;

  @ManyToOne(() => BoardColumn, (column) => column.toHistories)
  @JoinColumn({ name: 'to_column_id' })
  toColumn: BoardColumn;

  @ManyToOne(() => User, (user) => user.columnHistories, { nullable: true })
  @JoinColumn({ name: 'moved_by' })
  movedByUser: User;

  @CreateDateColumn({ name: 'moved_at' })
  movedAt: Date;
}
