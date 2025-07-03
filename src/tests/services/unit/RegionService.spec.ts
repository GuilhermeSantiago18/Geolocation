import sinon from "sinon";
import { expect } from "chai";
import mongoose from "mongoose";

import {
  createRegionService,
  deleteRegionService,
} from "../../../services/Region/RegionService";
import { Region } from "../../../models/Region/RegionModel";
import { CustomError } from "../../../errors/CustomError";
import { IRegion } from "../../../types/IRegion";

describe("Unit: deleteRegionService", () => {
  let findOneStub: sinon.SinonStub;
  let deleteOneStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;

  const fakeId = new mongoose.Types.ObjectId();

  afterEach(() => {
    sinon.restore();
  });

  it("should delete region when found", async () => {
    findOneStub = sinon.stub(Region, "findOne").resolves({ _id: fakeId });
    deleteOneStub = sinon.stub(Region, "deleteOne").resolves({
      deletedCount: 1,
      acknowledged: false,
    });

    await deleteRegionService(fakeId);

    expect(findOneStub.calledOnce).to.be.equal(true);
    expect(deleteOneStub.calledOnce).to.be.equal(true);
  });

  it("should throw CustomError when region is not found", async () => {
    findOneStub = sinon.stub(Region, "findOne").resolves(null);

    try {
      await deleteRegionService(fakeId);
      throw new Error("Expected error was not thrown");
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      expect((err as CustomError).message).to.equal("Region not found");
      expect((err as CustomError).statusCode).to.equal(404);
    }

    expect(findOneStub.calledOnce).to.be.equal(true);
  });

  it("should create a region when sent correct Data", async () => {
    const data = {
      name: "Ceara Mirim 5",
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-35.42647, -5.64583],
            [-35.43031, -5.6473],
            [-35.43286, -5.64345],
            [-35.42826, -5.64103],
            [-35.42647, -5.64583],
          ],
        ],
      },
    } as Partial<IRegion> & Document;

    const mockRegion = {
      _id: fakeId,
      ...data,
    };

    createStub = sinon
      .stub(Region, "create")
      .resolves(
        mockRegion as unknown as Awaited<ReturnType<typeof Region.create>>,
      );

    const result = await createRegionService(data as IRegion);

    expect(createStub.calledOnce).to.be.equal(true);
    expect(result).to.deep.equal(mockRegion);
    expect(result.name).to.be.equal(data.name);
    expect(result.geometry).to.deep.equal(data.geometry);
  });
});
