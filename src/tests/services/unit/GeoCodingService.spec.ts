import sinon from "sinon";
import { expect } from "chai";
import axios from "axios";

import { geocodeAddress } from "../../../services/geoCodingService";
import { CustomError } from "../../../errors/CustomError";
import { HttpStatusCode } from "../../../constants/httpStatus";

describe("Unit: GeoCodingService", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return coordinates when API returns valid data", async () => {
    const fakeData = [{ lat: "12.34", lon: "56.78" }];
    const axiosGetStub = sinon.stub(axios, "get").resolves({ data: fakeData });

    const result = await geocodeAddress("valid address");

    expect(axiosGetStub.calledOnce).to.be.equal(true);
    expect(result).to.deep.equal({ lat: 12.34, lng: 56.78 });
  });

  it("should throw CustomError with 400 if API returns empty array", async () => {
    sinon.stub(axios, "get").resolves({ data: [] });

    try {
      await geocodeAddress("address not found");
      expect.fail("Expected to throw CustomError");
    } catch (error) {
      expect(error as CustomError).to.be.instanceOf(CustomError);
      expect((error as CustomError).message).to.be.equal("region.notFound");
      expect((error as CustomError).statusCode).to.be.equal(
        HttpStatusCode.BAD_REQUEST,
      );
    }
  });

  it("should throw CustomError with 502 if axios throws non-CustomError", async () => {
    sinon.stub(axios, "get").rejects(new Error("Network failure"));

    try {
      await geocodeAddress("any address");
      expect.fail("Expected to throw CustomError");
    } catch (error) {
      expect(error as CustomError).to.be.instanceOf(CustomError);
      expect((error as CustomError).message).to.equal(
        "region.fetch.coordinates",
      );
      expect((error as CustomError).statusCode).to.equal(
        HttpStatusCode.BAD_GATEWAY,
      );
    }
  });
});
