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
      "Name must be a non-empty string",
    );
  });

  it("should throw when geometry is not an object", () => {
    const invalid = { geometry: null } as unknown as Partial<IRegion>;
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "Geometry must be an object",
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
      'Geometry.type must be "Polygon"',
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
      "Geometry.coordinates must be an array",
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
      "Geometry.coordinates cannot be empty",
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
            [3, 4],
          ],
        ],
      },
    };
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      "Ring 0 must be closed",
    );
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
      /must be an array/,
    );
  });

  it("should throw if a point does not have 2 numbers", () => {
    const invalid: Partial<IRegion> = {
      geometry: {
        type: "Polygon",
        coordinates: [[[[1, 2], [3, 4], [5], [1, 2]]]],
      },
    } as unknown as Partial<IRegion>;
    expect(() => validateUpdateRegion(invalid)).to.throw(
      CustomError,
      /must have exactly 2 numbers/,
    );
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
