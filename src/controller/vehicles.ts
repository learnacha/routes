import { RequestHandler } from "express";
import {
  VehicleType,
  VehicleCategory,
  Schedule,
  Route,
} from "../models/vehicle";
import { VehicleInput } from "../types/vehicle";
import {
  findOrCreateVehicleType,
  findOrCreateCategory,
  findOrCreateSchedule,
  findOrCreateVehicleRoute,
  getVehicleRoute,
  sendInternalServer,
} from "./vehicle.helper";

/**
 * This function decsontructs the route details
 * 
 * creates the vehicle type if not exists and update the vehicle type count
 * 
 * creates the vehicle category if not exists
 * 
 * creates the schedule if not exists
 * 
 * creates the route if not exists
 * 
 * send the response with vehicle details including id and count
 * @param req contains the valid request object
 * @param res sends the response object
 * @returns valid response object
 */

export const createVehicleOp: RequestHandler = async (req, res) => {
  try {
    const {
      vehicleType: vehicleTypeInput,
      category: vehicleCategoryInput,
      schedule: {
        dayOfWeek,
        startTime: scheduleStartTime,
        endTime: scheduleEndTime,
      },
      route: {
        startLocation,
        endLocation,
        startTime: routeStartTime,
        endTime: routeEndTime,
      },
    } = req.body as VehicleInput;

    const vehicleType = await findOrCreateVehicleType(vehicleTypeInput);

    const vehicleCategory = await findOrCreateCategory(
      vehicleCategoryInput,
      vehicleType.vehicle_type_id
    );

    const schedule = await findOrCreateSchedule({
      dayOfWeek,
      startTime: scheduleStartTime,
      endTime: scheduleEndTime,
      categoryId: vehicleCategory.category_id,
    });

    const route = await findOrCreateVehicleRoute({
      startLocation,
      endLocation,
      startTime: routeStartTime,
      endTime: routeEndTime,
      scheduleId: schedule.schedule_id,
    });

    const newVehicle = getVehicleRoute(route);

    return res.status(201).send(newVehicle);
  } catch (error) {
    sendInternalServer(res, error as Error);
  }
};


/***
 * This function returns all the routes
 */

export const getAllVehicles: RequestHandler = async (req, res) => {
  try {
    const routes = await Route.findAll({
      include: [
        {
          model: Schedule,
          include: [{ model: VehicleCategory, include: [VehicleType] }],
        },
      ],
    });

    res.status(200).json(routes.map((route) => getVehicleRoute(route)));
  } catch (error) {
    sendInternalServer(res, error as Error);
  }
};

/***
 * This function returns all the route based on ID
 */
export const getVehicleTypeById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const route = await Route.findOne({
      where: { route_id: id },
      include: [
        {
          model: Schedule,
          include: [
            {
              model: VehicleCategory,
              include: [
                {
                  model: VehicleType,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!route) {
      return res.status(404).json({ message: `Route with id ${id} not found` });
    }

    return res.status(200).json(getVehicleRoute(route));
  } catch (error) {
    sendInternalServer(res, error as Error);
  }
};
