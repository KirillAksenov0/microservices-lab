import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Идентификатор пользователя',
    name: 'user_id',
  })
  readonly userId: string;

  @Column('varchar', {
    comment: 'Номер телефона пользователя',
    nullable: false,
    length: 20,
  })
  phone: string;

  @Column('varchar', {
    comment: 'Логин пользователя',
    nullable: false,
    length: 20,
  })
  login: string;

  @Column('varchar', {
    comment: 'Имя',
    nullable: false,
  })
  firstName: string;

  @Column('varchar', {
    comment: 'Фамилия',
    nullable: false,
  })
  lastName: string;

  @Column('varchar', {
    comment: 'Хеш пароля',
    nullable: false,
  })
  passwordHash: string;

  @Column('varchar', {
    comment: 'Соль пароля',
    nullable: false,
  })
  passwordSalt: string;
}