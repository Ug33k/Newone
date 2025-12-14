import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BoardColumn } from './column.entity';
import { Swimlane } from './swimlane.entity';
import { ClassService } from './class-service.entity';
import { ColumnHistory } from './column-history.entity';
import { Metric } from './metric.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'column_id' })
  columnId: string;

  @Column({ name: 'swimlane_id', nullable: true })
  swimlaneId: string;

  @Column({ name: 'class_service_id', nullable: true })
  classServiceId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  position: number;

  @ManyToOne(() => BoardColumn, (column) => column.cards)
  @JoinColumn({ name: 'column_id' })
  column: BoardColumn;

  @ManyToOne(() => Swimlane, (swimlane) => swimlane.cards, { nullable: true })
  @JoinColumn({ name: 'swimlane_id' })
  swimlane: Swimlane;

  @ManyToOne(() => ClassService, (classService) => classService.cards, {
    nullable: true,
  })
  @JoinColumn({ name: 'class_service_id' })
  classService: ClassService;

  @OneToMany(() => ColumnHistory, (history) => history.card)
  histories: ColumnHistory[];

  @OneToMany(() => Metric, (metric) => metric.card)
  metrics: Metric[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
