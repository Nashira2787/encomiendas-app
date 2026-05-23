import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
@Entity('factura')
export class Factura { @PrimaryGeneratedColumn() id:number; @Column({name:'pago_id',unique:true}) pagoId:number; @Column({name:'numero_factura',nullable:true}) numeroFactura:string; @Column({nullable:true}) nit:string; @Column({name:'razon_social',nullable:true}) razonSocial:string; @CreateDateColumn() fecha:Date; }
