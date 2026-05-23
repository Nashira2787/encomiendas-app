import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('cliente')
export class Cliente { @PrimaryGeneratedColumn() id:number; @Column() nombre:string; @Column() apellido:string; @Column({unique:true,nullable:true}) ci:string; @Column({nullable:true}) telefono:string; @Column({nullable:true}) email:string; @Column({type:'text',nullable:true}) direccion:string; @CreateDateColumn({name:'fecha_registro'}) fechaRegistro:Date; }
