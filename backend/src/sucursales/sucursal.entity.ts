import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('sucursal')
export class Sucursal { @PrimaryGeneratedColumn() id:number; @Column() nombre:string; @Column({type:'text'}) direccion:string; @Column({nullable:true}) ciudad:string; @Column({nullable:true}) telefono:string; }
