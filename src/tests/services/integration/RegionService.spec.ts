import { expect } from "chai";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  createRegionService,
  deleteRegionService,
  updateRegionService,
} from "../../../services/Region/RegionService";

import { IRegion } from "../../../types/IRegion";
import { Region } from "../../../models/Region/RegionModel";
import { CustomError } from "../../../errors/CustomError";

describe("Integration Region Service Tests", () => {
  let mongoServer: MongoMemoryServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  it("DeleteRegionService / should delete an existing region successfully", async () => {
    const regionData: IRegion = {
      name: "Test Region",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-46.634, -23.551],
            [-46.634, -23.549],
            [-46.631, -23.549],
            [-46.631, -23.551],
            [-46.634, -23.551],
          ],
        ],
      },
    };

    const created = await createRegionService(regionData);
    await deleteRegionService(created._id);

    const found = await Region.findById(created._id);
    expect(found).to.be.equal(null);
  });

  it("DeleteRegionService / should throw an error when trying to delete a non-existing region", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    try {
      await deleteRegionService(fakeId);
      throw new Error("Expected error was not thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(CustomError);
      expect((error as CustomError).statusCode).to.equal(404);
      expect((error as CustomError).message).to.equal("Region not found");
    }
  });

  it("UpdateRegionService / should update the name of region", async () => {
    const regionData: IRegion = {
      name: "Test Region",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-46.634, -23.551],
            [-46.634, -23.549],
            [-46.631, -23.549],
            [-46.631, -23.551],
            [-46.634, -23.551],
          ],
        ],
      },
    };

    const regionDataUpdated = {
      name: "Test Region Updated",
    };

    const created = await createRegionService(regionData);
    const updatedRegion = await updateRegionService(
      created._id,
      regionDataUpdated,
    );

    expect(updatedRegion).to.have.property("name", "Test Region Updated");
  });

  it("UpdateRegionService / should throw an error when trying to update a non-existing region", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const regionDataUpdated = {
      name: "Test Region Updated",
    };
    try {
      await updateRegionService(fakeId, regionDataUpdated);
      throw new Error("Expected error was not thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(CustomError);
      expect((error as CustomError).statusCode).to.equal(404);
      expect((error as CustomError).message).to.equal("Region not found");
    }
  });
});
