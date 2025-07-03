import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../../app";
import { Region } from "../../../models/Region/RegionModel";
import { IRegion } from "../../../types/IRegion";

describe("Integration Region Controller Tests", () => {
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

  it("POST / should create a region", async () => {
    const res = await request(app)
      .post("/region")
      .send({
        name: "Test Region",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-46.6333, -23.5505],
              [-46.6325, -23.5505],
              [-46.6325, -23.5495],
              [-46.6333, -23.5495],
              [-46.6333, -23.5505],
            ],
          ],
        },
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("name", "Test Region");
  });

  it("GET / should list all regions", async () => {
    await Region.create([
      {
        name: "Region 1",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-46.6333, -23.5505],
              [-46.6325, -23.5505],
              [-46.6325, -23.5495],
              [-46.6333, -23.5495],
              [-46.6333, -23.5505],
            ],
          ],
        },
      },
      {
        name: "Region 2",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-46.6333, -23.5505],
              [-46.6325, -23.5505],
              [-46.6325, -23.5495],
              [-46.6333, -23.5495],
              [-46.6333, -23.5505],
            ],
          ],
        },
      },
    ]);

    const res = await request(app).get("/region");

    const body = res.body as IRegion[];

    expect(res.status).to.equal(200);
    expect(body).to.be.an("array");
    expect(body.length).to.be.at.least(2);

    const names = body.map((region: IRegion) => region.name);
    expect(names).to.include("Region 1");
    expect(names).to.include("Region 2");
  });

  it("DELETE / should delete a region", async () => {
    const regions = await Region.create([
      {
        name: "Region 1",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [1, 0],
              [0, 1],
              [1, 1],
              [1, 0],
            ],
          ],
        },
      },
    ]);

    const idToDelete = regions[0]._id.toString();

    const res = await request(app).delete(`/region/${idToDelete}`).send();

    expect(res.status).to.equal(204);

    const regionAfterDelete = await Region.findById(idToDelete);
    expect(regionAfterDelete).to.be.equal(null);
  });

  it("UPDATE / should update a region", async () => {
    const region = await Region.create({
      name: "Old Name",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 0],
          ],
        ],
      },
    });

    const updatedData = {
      name: "New Name",
    };

    const res = await request(app)
      .put(`/region/${region._id.toString()}`)
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("name", "New Name");

    const updatedRegion = await Region.findById(region._id);
    expect(updatedRegion?.name).to.equal("New Name");
  });

  it("UPDATE / should update a region", async () => {
    const region = await Region.create({
      name: "Old Name",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 0],
          ],
        ],
      },
    });

    const updatedData = {
      name: "New Name",
    };

    const res = await request(app)
      .put(`/region/${region._id.toString()}`)
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("name", "New Name");

    const updatedRegion = await Region.findById(region._id);
    expect(updatedRegion?.name).to.equal("New Name");
  });

  it("GET /regions/contains should return a region containing a point", async () => {
    await Region.create({
      name: "Region A",
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
    });

    const res = await request(app)
      .get(`/region/contains`)
      .query({ lng: -46.634, lat: -23.551 });

    const body = res.body as IRegion[];

    expect(res.status).to.equal(200);
    expect(body).to.be.an("array");
    expect(body.length).to.equal(1);
    expect(body[0]).to.have.property("name", "Region A");
  });

  it("GET /regions/nearby should return a region nearby distance", async () => {
    await Region.create({
      name: "Region A",
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
    });

    const res = await request(app)
      .get(`/region/nearby`)
      .query({ lng: -46.634, lat: -23.551, distance: 500 });

    const body = res.body as IRegion[];

    expect(res.status).to.equal(200);
    expect(body).to.be.an("array");
    expect(body.length).to.equal(1);
    expect(body[0]).to.have.property("name", "Region A");
  });

  it("GET /regions/address should return a region by address", async () => {
    await Region.create({
      name: "Region A",
      geometry: {
        type: "Polygon",
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
    });

    const res = await request(app)
      .get(`/region/address`)
      .query({ address: "Rua doutor jose augusto meira" });

    const body = res.body as IRegion[];

    expect(res.status).to.equal(200);
    expect(body).to.be.an("array");
    expect(body.length).to.equal(1);
    expect(body[0]).to.have.property("name", "Region A");
  });

  it("GET /regions/address should return an Error when address is empty", async () => {
    await Region.create({
      name: "Region A",
      geometry: {
        type: "Polygon",
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
    });

    const res = await request(app)
      .get(`/region/address`)
      .query({ address: "" });

    interface ErrorResponse {
      errorMessage: string;
    }

    const body = res.body as ErrorResponse;

    expect(res.status).to.equal(400);
    expect(body.errorMessage).to.equal(
      "Address is required and must be a string",
    );
  });
});
