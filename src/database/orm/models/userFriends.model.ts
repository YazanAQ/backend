import User from "./user.model";
import { CreationOptional, DataTypes } from "sequelize";
import {
  BelongsTo,
  Column,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import {
  FRIEND_STATUS,
  getDate,
  getIsoTimestamp,
  setDate,
  USER_FRIENDS_TABLE_NAME,
} from "../../lib";

@Table({
  modelName: "UserFriends",
  paranoid: true,
  tableName: USER_FRIENDS_TABLE_NAME,
  underscored: true,
})
export class UserFriends extends Model<UserFriends> {
  @CreatedAt
  @Column({
    allowNull: false,
    comment: "Friend created DateTime",
    defaultValue: getIsoTimestamp,
    get: getDate("createdAt"),
    set: setDate("createdAt"),
    type: DataTypes.DATE,
  })
  public createdAt: CreationOptional<Date>;
  @DeletedAt
  @Column({
    allowNull: true,
    comment: "Friend deleted DateTime",
    defaultValue: null,
    type: DataTypes.DATE,
  })
  public deletedAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({
    allowNull: false,
    comment: "Friend updated DateTime",
    defaultValue: getIsoTimestamp,
    get: getDate("updatedAt"),
    set: setDate("updatedAt"),
    type: DataTypes.DATE,
  })
  public updatedAt: Date;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  userId: string;

  @Column
  status: FRIEND_STATUS;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  friendId: string;

  @BelongsTo(() => User, "userId")
  user: User;

  @BelongsTo(() => User, "friendId")
  friend: User;
}

export default UserFriends;
