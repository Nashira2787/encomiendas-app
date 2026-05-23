import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('seguimiento')
export class Seguimiento { @PrimaryGeneratedColumn() id:number; @Column({name:'envio_id'}) envioId:number; @Column({name:'estado_id'}) estadoId:number; @Column({type:'text',nullable:true}) ubicacion:string; @CreateDateColumn() fecha:Date; @Column({type:'text',nullable:true}) observaciones:string; }
