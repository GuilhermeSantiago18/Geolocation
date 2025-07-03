import { expect } from "chai";
import sinon from "sinon";
import { Request, Response, NextFunction } from "express";
import { errorMiddleware } from "../../middlewares/errorMiddleware";
import { CustomError } from "../../errors/CustomError";
import { HttpStatusCode } from "../../constants/httpStatus";

describe("Unit: Middleware: errorMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonStub: sinon.SinonStub;
  let statusStub: sinon.SinonStub;

  beforeEach(() => {
    req = {};
    jsonStub = sinon.stub();
    statusStub = sinon.stub().returns({ json: jsonStub });
    res = {
      status: statusStub,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should handle CustomError correctly", () => {
    const customError = new CustomError(
      "Custom failure",
      HttpStatusCode.IM_TEAPOT,
    );

    errorMiddleware(
      customError,
      req as Request,
      res as Response,
      {} as NextFunction,
    );

    expect(statusStub.calledWith(HttpStatusCode.IM_TEAPOT)).to.be.equal(true);
    expect(jsonStub.calledWith({ errorMessage: "Custom failure" })).to.be.equal(
      true,
    );
  });

  it("should handle generic Error with default 500", () => {
    const genericError = new Error("Generic failure");

    errorMiddleware(
      genericError,
      req as Request,
      res as Response,
      {} as NextFunction,
    );

    expect(
      statusStub.calledWith(HttpStatusCode.INTERNAL_SERVER_ERROR),
    ).to.be.equal(true);
    expect(
      jsonStub.calledWith({ errorMessage: "Generic failure" }),
    ).to.be.equal(true);
  });
});
