import {
  VehicleType,
  VehicleCategory,
  Schedule,
  Route,
  DayOfWeek,
} from "../models/vehicle";

const vehicleTypeName = "SUV";
const vehicleCategoryId = 1;
const vehicleCategoryName = "STANDARD";

const createVehicleType = async () => {
  return VehicleType.create({
    vehicle_type_name: vehicleTypeName,
    count: 1,
  });
};

const createVehicleCategory = async (vehicle_type_id: number) => {
  return await VehicleCategory.create({
    category_name: vehicleCategoryName,
    vehicle_type_id,
  });
};

const createVehicleSchedule = async () => {
  const vehicleType = await createVehicleType();

  const createdVehicleCategory = await createVehicleCategory(
    vehicleType.vehicle_type_id
  );
  const scheduleInput = {
    dayOfWeek: DayOfWeek["Monday"],
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    categoryId: createdVehicleCategory.category_id,
  };

  return Schedule.create({
    day_of_week: scheduleInput.dayOfWeek,
    start_time: scheduleInput.startTime,
    end_time: scheduleInput.endTime,
    category_id: scheduleInput.categoryId,
  });
};

export {
  vehicleTypeName,
  vehicleCategoryId,
  vehicleCategoryName,
  createVehicleType,
  createVehicleCategory,
  createVehicleSchedule,
};
