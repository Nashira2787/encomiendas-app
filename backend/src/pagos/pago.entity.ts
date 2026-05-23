import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('pago')
export class Pago { @PrimaryGeneratedColumn() id:number; @Column({name:'envio_id',nullable:true}) envioId:number; @Column({type:'decimal',precision:10,scale:2,nullable:true}) monto:number; @Column({nullable:true}) metodo:string; @CreateDateColumn() fecha:Date; }
