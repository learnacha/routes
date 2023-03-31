import { Model, Column, Table, HasMany, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';

export enum CategoryNameEnum {
  STANDARD = 'STANDARD',
  STANDBY = 'STANDBY',
  WHEELCHAIR = 'WHEELCHAIR'
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

@Table({ timestamps: true })
class VehicleType extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  vehicle_type_id!: number;

  @Column({
    type: DataType.INTEGER
  })
  count!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  vehicle_type_name!: string;

  @HasMany(() => VehicleCategory)
  categories!: VehicleCategory[];
}

@Table({ timestamps: true })
class VehicleCategory extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  category_id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(DayOfWeek)),
    allowNull: false
  })
  category_name!: string;

  @ForeignKey(() => VehicleType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  vehicle_type_id!: number;

  @BelongsTo(() => VehicleType)
  vehicle_type!: VehicleType;

  @HasMany(() => Schedule)
  schedules!: Schedule[];
}

@Table({ timestamps: true })
class Schedule extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  schedule_id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(CategoryNameEnum)),
    allowNull: false
  })
  day_of_week!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false
  })
  start_time!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false
  })
  end_time!: string;

  @ForeignKey(() => VehicleCategory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  category_id!: number;

  @BelongsTo(() => VehicleCategory)
  category!: VehicleCategory;

  @HasMany(() => Route)
  routes!: Route[];
}

@Table({ timestamps: true })
class Route extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER
  })
  route_id!: number;

  @ForeignKey(() => Schedule)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  schedule_id!: number;

  @Column({
    type: DataType.TIME,
    allowNull: false
  })
  start_time!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false
  })
  end_time!: string;

  @BelongsTo(() => Schedule)
  schedule!: Schedule;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  start_location!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  end_location!: string;
}

export { VehicleType, VehicleCategory, Schedule, Route };
