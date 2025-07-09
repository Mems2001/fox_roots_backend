'use strict';

import { Column, DataType, Default, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { UserModel } from '../types/models';

interface UserCreationAttributes extends Optional<UserModel, 'id'> {}

@Table({
  tableName: 'users',
  modelName: 'Users'
})
export class User extends Model<UserModel, UserCreationAttributes> {

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  declare id:string;

  @Column(DataType.STRING)
  email: string;
  
}