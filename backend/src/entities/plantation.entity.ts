import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IrrigationLog } from './irrigation-log.entity';

export enum IrrigationStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

@Entity('plantations')
export class Plantation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  cropType: string;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({
    type: 'enum',
    enum: IrrigationStatus,
    default: IrrigationStatus.ACTIVE,
  })
  status: IrrigationStatus;

  // Log de alterações (One-to-Many)
  @OneToMany(() => IrrigationLog, (log) => log.plantation)
  logs: IrrigationLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
