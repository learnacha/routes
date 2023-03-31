import { Sequelize } from "sequelize-typescript";
import {VehicleType, VehicleCategory, Schedule, Route} from '../models/vehicle';

const connection = new Sequelize({
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "root",
  password: "example_pass",
  database: "vehicleop",
  logging: false,
  models: [VehicleType, VehicleCategory, Schedule, Route]
});

export default connection;
