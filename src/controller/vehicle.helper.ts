import { Response } from "express";
import {
  convertTimeTo24HourFormat,
  convertTimeToAMPMFormat,
} from "../utils/time";

import {
  VehicleType,
  VehicleCategory,
  Schedule,
  Route,
} from "../models/vehicle";
import {
  RouteDBInput,
  ScheduleDBInput,
  VehicleInput,
  VehicleOuput,
} from "../types/vehicle";

/**
 * async function that takes a `vehicleTypeName` parameter of type string of `VehicleType` like SUV, SEDAN etc.
 * if vehicleTypeName exists, it will increase the vehicle type count and returns the object
 * if the vehicleTypeName does not exist, it will create a new vehicle type and return the object
 * @param vehicleTypeName
 * @returns Promise of VehicleType
 */
async function findOrCreateVehicleType(
  vehicleTypeName: string
): Promise<VehicleType> {
  let vehicleType = await VehicleType.findOne({
    where: { vehicle_type_name: vehicleTypeName },
  });
  if (!vehicleType) {
    vehicleType = await VehicleType.create({
      vehicle_type_name: vehicleTypeName,
      count: 1,
    });
  } else {
    vehicleType.count += 1;
    await vehicleType.save();
  }

  return vehicleType;
}

/**
 * async function that takes a `vehicleCategoryName` parameter of type string of `VehicleCategory`
 *
 * if vehicleCategoryName with vehicleTypeId exists, it will returns the vehicle category object
 *
 * if the vehicleCategoryName does not exist, it will create a new vehicle category and return the object
 * @param vehicleCategoryName of VehicleInput['category']
 * @param vehicleTypeId reference of the vehicle type
 * @returns Promise of VehicleCategory
 */
async function findOrCreateCategory(
  vehicleCategoryName: VehicleInput["category"],
  vehicleTypeId: number
): Promise<VehicleCategory> {
  let category = await VehicleCategory.findOne({
    where: {
      category_name: vehicleCategoryName,
      vehicle_type_id: vehicleTypeId,
    },
  });
  if (!category) {
    category = await VehicleCategory.create({
      category_name: vehicleCategoryName,
      vehicle_type_id: vehicleTypeId,
    });
  }
  return category;
}

/**
 * async function that takes a `vehicleCategoryName` parameter of type string of `VehicleCategory`
 *
 * if vehicleCategoryName exists, it will increase the vehicle category count and returns the object
 *
 * if the vehicleCategoryName does not exist, it will create a new vehicle type and return the object
 * @param dayOfWeek of ScheduleDBInput['dayOfWeek'] -- string of 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
 * @param startTime of string of time
 * @param endTime of string of time
 * @param categoryId of vehicle category id
 * @returns Promise of Schedule
 */
async function findOrCreateSchedule({
  dayOfWeek,
  startTime,
  endTime,
  categoryId,
}: ScheduleDBInput): Promise<Schedule> {
  let schedule = await Schedule.findOne({
    where: {
      day_of_week: dayOfWeek,
      start_time: convertTimeTo24HourFormat(startTime),
      end_time: convertTimeTo24HourFormat(endTime),
      category_id: categoryId,
    },
  });
  if (!schedule) {
    schedule = await Schedule.create({
      day_of_week: dayOfWeek,
      start_time: convertTimeTo24HourFormat(startTime),
      end_time: convertTimeTo24HourFormat(endTime),
      category_id: categoryId,
    });
  }
  return schedule;
}

/**
 * The function accepts object of startLocation, endLocation, startTime, endTime and scheduleId
 *
 * converts the startTime and endTime to 24HourFormat
 *
 * add the route to the route table
 * @param ScheduleDBInput which contains startLocation, endLocation, startTime, endTime and scheduleId
 * @returns Promise Route
 */

async function findOrCreateVehicleRoute({
  startLocation,
  endLocation,
  startTime,
  endTime,
  scheduleId,
}: RouteDBInput): Promise<Route> {
  let newRoute = await Route.findOne({
    where: {
      start_location: startLocation,
      end_location: endLocation,
      start_time: convertTimeTo24HourFormat(startTime),
      end_time: convertTimeTo24HourFormat(endTime),
      schedule_id: scheduleId,
    },
  });

  if (!newRoute) {
    newRoute = await Route.create({
      start_location: startLocation,
      end_location: endLocation,
      start_time: convertTimeTo24HourFormat(startTime),
      end_time: convertTimeTo24HourFormat(endTime),
      schedule_id: scheduleId,
    });
  }

  // Reload the route with associated schedule and category data
  return newRoute.reload({
    include: [
      {
        model: Schedule,
        include: [
          {
            model: VehicleCategory,
            include: [{ model: VehicleType }],
          },
          Route,
        ],
      },
    ],
  });
}

/**
 * The function accepts route object which contains the nested details of the route
 *
 * it then deconstructs and return the route details
 * @param route contains the nest object of the route
 * @returns object of VehicleOuput
 */

function getVehicleRoute(route: Route): VehicleOuput {
  const {
    route_id,
    start_location,
    end_location,
    start_time,
    end_time,
    schedule: {
      start_time: schedule_start_time,
      end_time: schedule_end_time,
      category,
    },
    schedule: {
      category: { vehicle_type },
    },
  } = route;

  const vehicleCategory = category.category_name as VehicleInput["category"];
  const dayOfWeek = route.schedule.day_of_week as ScheduleDBInput["dayOfWeek"];

  return {
    id: route_id,
    vehicleType: vehicle_type.vehicle_type_name,
    vehicleTypeCount: vehicle_type.count,
    category: vehicleCategory,
    schedule: {
      dayOfWeek,
      startTime: convertTimeToAMPMFormat(schedule_start_time),
      endTime: convertTimeToAMPMFormat(schedule_end_time),
    },
    route: {
      startLocation: start_location,
      endLocation: end_location,
      startTime: convertTimeToAMPMFormat(start_time),
      endTime: convertTimeToAMPMFormat(end_time),
    },
  };
}

/**
 * Common function to respond to error
 * logs the error
 * send 500 internal error
 * @param res of Response object
 * @param error of Error object
 * @retun status of 500 internal server error
 */

export const sendInternalServer = (res: Response, error: Error) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

export {
  findOrCreateVehicleType,
  findOrCreateSchedule,
  findOrCreateCategory,
  findOrCreateVehicleRoute,
  getVehicleRoute,
};
