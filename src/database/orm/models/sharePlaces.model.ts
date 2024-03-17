import Place from "./place.model";
import User from "./user.model";
import { CreationOptional, DataTypes } from "sequelize";
import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";

import {
  getDate,
  getIsoTimestamp,
  setDate,
  SHARE_PLACES_TABLE_NAME,
} from "../../lib";

@Table({
  modelName: "SharedPlaces",
  tableName: SHARE_PLACES_TABLE_NAME,
  underscored: true,
})
export class SharedPlaces extends Model<SharedPlaces> {
  @CreatedAt
  @Column({
    allowNull: false,
    comment: "Share Place created DateTime",
    defaultValue: getIsoTimestamp,
    get: getDate("createdAt"),
    set: setDate("createdAt"),
    type: DataTypes.DATE,
  })
  public createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({
    allowNull: false,
    comment: "Share Place updated DateTime",
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

  @BelongsTo(() => User)
  user: User;

  @PrimaryKey
  @ForeignKey(() => Place)
  @Column
  placeId: string;

  @BelongsTo(() => Place)
  place: Place;
}

export default SharedPlaces;
