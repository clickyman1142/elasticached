import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("student")
export class StudentEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string;

    @Column()
    public score: number;
}