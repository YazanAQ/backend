import { SharedPlaces } from "./sharePlaces.model";
import { UserFriends } from "./userFriends.model";
import { CreationOptional, DataTypes } from "sequelize";
import {
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  IsEmail,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import { getDate, getIsoTimestamp, setDate, USERS_TABLE_NAME } from "../../lib";

@Table({
  modelName: "User",
  paranoid: true,
  tableName: USERS_TABLE_NAME,
  underscored: true,
})
export class User extends Model<User> {
  @CreatedAt
  @Column({
    allowNull: false,
    comment: "User created DateTime",
    defaultValue: getIsoTimestamp,
    get: getDate("createdAt"),
    set: setDate("createdAt"),
    type: DataTypes.DATE,
  })
  public createdAt: CreationOptional<Date>;

  @DeletedAt
  @Column({
    allowNull: true,
    comment: "User deleted DateTime",
    defaultValue: null,
    type: DataTypes.DATE,
  })
  public deletedAt: CreationOptional<Date>;

  @IsEmail
  @Column({
    allowNull: false,
    comment: "User Email",
    type: DataTypes.STRING,
  })
  public email: string;

  @Column({
    allowNull: true,
    comment: "name",
    type: DataTypes.STRING,
  })
  public name: string;

  @PrimaryKey
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
  })
  public id: string;

  @Column({
    allowNull: true,
    comment: "Image URL",
    type: DataTypes.STRING,
  })
  public imageUrl: string;

  @Column({
    allowNull: false,
    comment: "Wheather The User is active or not",
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  })
  public isActive: boolean;

  @Column({
    allowNull: true,
    comment: "Password",
    type: DataTypes.STRING,
  })
  public password: string;

  @Column({
    allowNull: false,
    comment: "id for each device logged in to app",
    type: DataTypes.STRING,
  })
  public deviceId: string;

  @Column({
    allowNull: true,
    comment:
      "social media data when the user registered using social media (google)",
    type: DataTypes.JSON,
  })
  public socialMedia: JSON;

  @UpdatedAt
  @Column({
    allowNull: false,
    comment: "User updated DateTime",
    defaultValue: getIsoTimestamp,
    get: getDate("updatedAt"),
    set: setDate("updatedAt"),
    type: DataTypes.DATE,
  })
  public updatedAt: Date;

  @HasMany(() => UserFriends)
  friends: User[];

  @HasMany(() => SharedPlaces)
  sharedPlaces: SharedPlaces[];
}

export default User;
