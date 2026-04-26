import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Plantation, IrrigationStatus } from './plantation.entity';

@Entity('irrigation_logs')
export class IrrigationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relacionamento com a Plantação
  @ManyToOne(() => Plantation, (plantation) => plantation.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plantation_id' })
  plantation: Plantation;

  @Column({ type: 'enum', enum: IrrigationStatus })
  previousStatus: IrrigationStatus;

  @Column({ type: 'enum', enum: IrrigationStatus })
  newStatus: IrrigationStatus;

  @Column({ type: 'text' })
  reason: string; // Ex: "Previsão de Chuva", "Ação Manual", etc.

  @Column({ type: 'jsonb', nullable: true })
  weatherDataSnapshot: any; // Opcional: salvar a previsão exata que causou a decisão para métricas/auditoria

  @CreateDateColumn()
  createdAt: Date;
}
