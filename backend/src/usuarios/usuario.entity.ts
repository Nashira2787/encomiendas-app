import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('usuario')
export class Usuario { @PrimaryGeneratedColumn() id:number; @Column({name:'nombre_usuario',unique:true}) nombreUsuario:string; @Column() password:string; @Column({nullable:true}) rol:string; @Column({default:true}) estado:boolean; }
