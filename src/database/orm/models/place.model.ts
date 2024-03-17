import SharedPlace from "./sharePlaces.model";
import User from "./user.model";
import { DataTypes } from "sequelize";
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

import { PLACE_TABLE_NAME } from "../../lib";

@Table({
  modelName: "Place",
  tableName: PLACE_TABLE_NAME,
  underscored: true,
})
export class Place extends Model<Place> {
  @PrimaryKey
  @Column({
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
  })
  public id: string;
  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  address: string;

  @Column({ allowNull: true, type: DataType.STRING })
  description: string;

  @Column({ allowNull: false, type: DataType.FLOAT })
  latitude: number;

  @Column({ allowNull: false, type: DataType.FLOAT })
  longitude: number;

  @ForeignKey(() => User)
  @Column
  ownerId: string;

  @BelongsTo(() => User)
  owner: User;

  @HasMany(() => SharedPlace)
  sharedWith: SharedPlace[];
}

export default Place;
