import { expect } from "chai";
import { validateUpdateRegion } from "../../../validations/validateDataUpdate";
import { CustomError } from "../../../errors/CustomError";
import { IRegion } from "../../../types/regionTypes";

describe("Unit: validateDataUpdate", () => {
  it("should not throw when name is valid", () => {
    const valid: Partial<IRegion> = { name: "Valid Name" };
    expect(() => validateUpdateRegion(valid)).to.not.throw();
  });

  it("should throw when name is empty string", () => {
    const invalid: Partial<IRegion> = { name: "" };
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "region.nameRequired",
    );
  });

  it("should throw when geometry is not an object", () => {
    const invalid = { geometry: null } as unknown as Partial<IRegion>;
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "region.geometryObjectInvalid",
    );
  });

  it("should throw if geometry.type is not Polygon", () => {
    const invalid = {
      geometry: {
        type: "Circle",
        coordinates: [],
      },
    } as unknown as Partial<IRegion>;
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "region.geometryTypeInvalid",
    );
  });

  it("should throw if coordinates is not an array", () => {
    const invalid = {
      geometry: {
        type: "Polygon",
        coordinates: null,
      },
    } as Partial<IRegion>;
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "region.coordinatesNotArray",
    );
  });

  it("should throw if coordinates is empty", () => {
    const invalid: Partial<IRegion> = {
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
    };

    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "region.coordinatesEmpty",
    );
  });

  it("should throw if a ring is not closed", () => {
    const invalid: Partial<IRegion> = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [1, 2],
            [2, 3],
            [3, 4], // não fecha
          ],
        ],
      },
    };

    try {
      validateUpdateRegion(invalid);
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      expect((err as CustomError).message).to.equal("region.ringNotClosed");
      expect((err as CustomError).options).to.deep.equal({ ringIndex: 0 });
    }
  });

  it("should throw if a point is not an array", () => {
    const invalid: Partial<IRegion> = {
      geometry: {
        type: "Polygon",
        coordinates: [[123, [1, 1], [1, 1], 123]],
      },
    } as unknown as Partial<IRegion>;

    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "region.pointNotArray",
    );
  });

  it("should throw if a point does not have 2 numbers", () => {
    const invalid: Partial<IRegion> = {
      geometry: {
        type: "Polygon",
        coordinates: [[[1, 1], [2], [3, 3], [1, 1]]],
      },
    };

    try {
      validateUpdateRegion(invalid);
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      expect((err as CustomError).message).to.equal(
        "region.pointInvalidLength",
      );
    }
  });

  it("should not throw if geometry is valid", () => {
    const valid: Partial<IRegion> = {
      name: "Valid",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [1, 1],
            [2, 2],
            [3, 3],
            [1, 1],
          ],
        ],
      },
    };
    expect(() => validateUpdateRegion(valid)).to.not.throw();
  });
});
