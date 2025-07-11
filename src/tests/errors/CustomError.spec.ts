import { expect } from "chai";
import { CustomError } from "../../errors/CustomError";
import { HttpStatusCode } from "../../constants/httpStatus";

describe("Unit: CustomError", () => {
  it("should create an instance with message and statusCode", () => {
    const error = new CustomError(
      "Something went wrong",
      HttpStatusCode.BAD_REQUEST,
    );

    expect(error).to.be.instanceOf(Error);
    expect(error).to.be.instanceOf(CustomError);
    expect(error.message).to.equal("Something went wrong");
    expect(error.statusCode).to.equal(HttpStatusCode.BAD_REQUEST);
    expect(error.name).to.equal("CustomError");
  });

  it("should default statusCode to 500 if not provided", () => {
    const error = new CustomError("Internal Server Error");

    expect(error.statusCode).to.equal(HttpStatusCode.INTERNAL_SERVER_ERROR);
  });
});
