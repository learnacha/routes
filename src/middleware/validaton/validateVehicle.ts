import * as z from 'zod';
import { Request, Response, NextFunction } from 'express';

// Define the Zod schema
export const vehicleCategoryEnum = z.enum(['STANDARD', 'STANDBY', 'WHEELCHAIR']);
export const dayOfWeekEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

const routeSchema = z.object({
  startLocation: z.string(),
  endLocation: z.string(),
  startTime: z.string().regex(/^\d{1,2}(:\d{2})?\s*(am|pm)$/i),
  endTime: z.string().regex(/^\d{1,2}(:\d{2})?\s*(am|pm)$/i),
});

const scheduleSchema = z.object({
  dayOfWeek: dayOfWeekEnum,
  startTime: z.string().regex(/^\d{1,2}(:\d{2})?\s*(am|pm)$/i),
  endTime: z.string().regex(/^\d{1,2}(:\d{2})?\s*(am|pm)$/i),
});

const vehicleSchema = z.object({
  vehicleType: z.string(),
  category: vehicleCategoryEnum,
  schedule: scheduleSchema,
  route: routeSchema,
});

// Define the middleware function
function validateVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    vehicleSchema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).json({ message: err });
  }
}

export {validateVehicle, vehicleSchema, scheduleSchema, routeSchema, };