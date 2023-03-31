import { Sequelize } from "sequelize-typescript";
import {
  VehicleType,
  VehicleCategory,
  Schedule,
  Route,
  DayOfWeek,
} from "../models/vehicle";
import {
  findOrCreateCategory,
  findOrCreateSchedule,
  findOrCreateVehicleType,
  findOrCreateVehicleRoute
} from "./vehicle.helper";
import {
  vehicleTypeName,
  vehicleCategoryName,
  vehicleCategoryId,
  createVehicleType,
  createVehicleCategory,
  createVehicleSchedule,
} from "./vehicle.mock";

describe("VehicleHelper", () => {
  let sequelize: Sequelize;

  beforeAll(() => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [VehicleType, VehicleCategory, Schedule, Route],
    });
  });

  beforeEach(async () => {
    // Sync the models with the database before each test
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Close the Sequelize connection after all tests have run
    await sequelize.close();
  });

  describe("findOrCreateVehicleType", () => {
    it("should create a new VehicleType if one does not exist", async () => {
      const createdVehicleType = await findOrCreateVehicleType(vehicleTypeName);
      expect(createdVehicleType.vehicle_type_name).toEqual(vehicleTypeName);
      expect(createdVehicleType.count).toEqual(1);
    });

    it("should update the count of an existing VehicleType", async () => {
      await createVehicleType();

      const updatedVehicleType = await findOrCreateVehicleType(vehicleTypeName);
      expect(updatedVehicleType.vehicle_type_name).toEqual(vehicleTypeName);
      expect(updatedVehicleType.count).toEqual(2);
    });
  });

  describe("findOrCreateCategory", () => {
    it("should create a new VehicleCategory if one does not exist", async () => {
      const vehicleType = await createVehicleType();

      const createdVehicleCategory = await findOrCreateCategory(
        vehicleCategoryName,
        vehicleType.vehicle_type_id
      );

      expect(createdVehicleCategory.category_id).toEqual(vehicleCategoryId);
      expect(createdVehicleCategory.category_name).toEqual(vehicleCategoryName);
      expect(createdVehicleCategory.vehicle_type_id).toEqual(
        vehicleType.vehicle_type_id
      );
    });

    it("should return an existing VehicleCategory", async () => {
      const vehicleType = await createVehicleType();
      const createdVehicleCategory = await createVehicleCategory(
        vehicleType.vehicle_type_id
      );

      const foundVehicleCategory = await findOrCreateCategory(
        vehicleCategoryName,
        vehicleType.vehicle_type_id
      );

      expect(foundVehicleCategory.category_id).toEqual(
        createdVehicleCategory.category_id
      );
      expect(foundVehicleCategory.category_name).toEqual(
        createdVehicleCategory.category_name
      );
      expect(foundVehicleCategory.vehicle_type_id).toEqual(
        createdVehicleCategory.vehicle_type_id
      );
    });
  });

  describe("findOrCreateSchedule", () => {
    it("should create a new Schedule if one does not exist", async () => {
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
      const createdSchedule = await findOrCreateSchedule(scheduleInput);
      expect(createdSchedule.day_of_week).toEqual(scheduleInput.dayOfWeek);
      expect(createdSchedule.start_time).toEqual("09:00:00");
      expect(createdSchedule.end_time).toEqual("17:00:00");
      expect(createdSchedule.category_id).toEqual(scheduleInput.categoryId);
    });

    it("should return an existing Schedule", async () => {
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

      await findOrCreateSchedule(scheduleInput);
      const existingSchedule = await findOrCreateSchedule(scheduleInput);
      expect(existingSchedule.day_of_week).toEqual(scheduleInput.dayOfWeek);
      expect(existingSchedule.start_time).toEqual("09:00:00");
      expect(existingSchedule.end_time).toEqual("17:00:00");
      expect(existingSchedule.category_id).toEqual(scheduleInput.categoryId);
    });
  });

  describe("findOrCreateVehicleRoute", () => {
    it("creates a new route in the database", async () => {
      const scheduleObj = await createVehicleSchedule();

      // Define test input data
      const testData = {
        startLocation: "Location A",
        endLocation: "Location B",
        startTime: "9:00 AM",
        endTime: "10:00 AM",
        scheduleId: scheduleObj.schedule_id,
      };

      // Call the function with the test data
      const newRoute = await findOrCreateVehicleRoute(testData);

      // Verify that a new Route instance was created in the database
      const createdRoute = await Route.findOne({
        where: {
          start_location: testData.startLocation,
          end_location: testData.endLocation,
          start_time: "09:00:00",
          end_time: "10:00:00",
          schedule_id: testData.scheduleId,
        },
      });

      expect(createdRoute).toBeDefined();
      expect(createdRoute!.id).toEqual(newRoute.id);
      expect(createdRoute!.start_location).toEqual(testData.startLocation);
      expect(createdRoute!.end_location).toEqual(testData.endLocation);
      expect(createdRoute!.start_time).toEqual("09:00:00");
      expect(createdRoute!.end_time).toEqual("10:00:00");
      expect(createdRoute!.schedule_id).toEqual(testData.scheduleId);
    });

    it("returns an existing route from the database", async () => {
      const scheduleObj = await createVehicleSchedule();

      // Define test input data
      const testData = {
        startLocation: "Location A",
        endLocation: "Location B",
        startTime: "9:00 AM",
        endTime: "10:00 AM",
        scheduleId: scheduleObj.schedule_id,
      };

      // Insert a Route instance into the database
      await Route.create({
        start_location: testData.startLocation,
        end_location: testData.endLocation,
        start_time: "09:00:00",
        end_time: "10:00:00",
        schedule_id: testData.scheduleId,
      });

      // Call the function with the test data
      const existingRoute = await findOrCreateVehicleRoute(testData);

      // Verify that the existing Route instance was returned from the database
      expect(existingRoute).toBeDefined();
      expect(existingRoute.start_location).toEqual(testData.startLocation);
      expect(existingRoute.end_location).toEqual(testData.endLocation);
      expect(existingRoute.start_time).toEqual("09:00:00");
      expect(existingRoute.end_time).toEqual("10:00:00");
      expect(existingRoute.schedule_id).toEqual(testData.scheduleId);
    });
  });
});
