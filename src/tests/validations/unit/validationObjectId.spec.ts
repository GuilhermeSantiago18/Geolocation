import { expect } from "chai";
import { validateObjectId } from "../../../validations/validateObjectId";
import { CustomError } from "../../../errors/CustomError";

describe("Unit: Validation Object Id", () => {
  it("should not throw when id is object ID", () => {
    const valid = { _id: "68656a8702fe3999a042a0ef" };
    expect(() => validateObjectId(valid._id)).to.not.throw();
  });

  it("should throw an CustomError when id is not object ID", () => {
    const valid = { _id: "asd" };
    expect(() => validateObjectId(valid._id)).to.throw(CustomError);
  });
});
