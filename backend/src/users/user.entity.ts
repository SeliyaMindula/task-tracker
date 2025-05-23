import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude() // Exclude password from serialization
  password: string;

  @Column({ default: 'user' })
  role: string; // 'user' or 'admin'
}