import { expect } from "chai";
import { CustomError } from "../../errors/CustomError";

describe("Unit: CustomError", () => {
  it("should create an instance with message and statusCode", () => {
    const error = new CustomError("Something went wrong", 400);

    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(CustomError);
    expect(error.message).to.equal("Something went wrong");
    expect(error.statusCode).to.equal(400);
    expect(error.name).to.equal("CustomError");
  });

  it("should default statusCode to 500 if not provided", () => {
    const error = new CustomError("Internal Server Error");

    expect(error.statusCode).to.equal(500);
  });
});
