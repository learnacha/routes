import { Router } from "express";

import {
  createVehicleOp,
  getAllVehicles,
  getVehicleTypeById,
} from "../controller/vehicles";
import { validateVehicle } from "../middleware/validaton/validateVehicle";

const vehicleRouter = Router();

vehicleRouter.post("/", validateVehicle, createVehicleOp);

vehicleRouter.get("/", getAllVehicles);

vehicleRouter.get("/:id", getVehicleTypeById);

export default vehicleRouter;
