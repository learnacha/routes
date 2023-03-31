import * as z from "zod";
import {
  vehicleSchema,
  scheduleSchema,
  routeSchema,
} from "../middleware/validaton/validateVehicle";

export type VehicleInput = z.infer<typeof vehicleSchema>;

export type VehicleOuput = z.infer<typeof vehicleSchema> & {
  id: number;
  vehicleTypeCount: number;
};

export type RouteDBInput = z.infer<typeof routeSchema> & {
  scheduleId: number;
};

export type ScheduleDBInput = z.infer<typeof scheduleSchema> & {
  categoryId: number;
};
