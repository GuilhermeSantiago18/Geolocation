// tests/region.controller.spec.ts
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import { Region } from '../../models/Region/Region';
import { IRegion } from '../../types/IRegion';

describe('Region Controller Integration Tests', () => {
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

  it('POST / should create a region', async () => {
    const res = await request(app)
      .post('/region')
      .send({
        name: 'Test Region',
        type: 'Polygon',
        coordinates: [
          [1, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('name', 'Test Region');
  });

  it('GET / should list all regions', async () => {
    await Region.create([
      {
        name: 'Region 1',
        type: 'Polygon',
        coordinates: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
      },
      {
        name: 'Region 2',
        type: 'Polygon',
        coordinates: [
          [1, 1],
          [1, 2],
          [2, 2],
          [2, 1],
        ],
      },
    ]);

    const res = await request(app).get('/region');

    const body = res.body as IRegion[]

    expect(res.status).to.equal(200);
    expect(body).to.be.an('array');
    expect(body.length).to.be.at.least(2);

    const names = body.map((region: IRegion) => region.name);
    expect(names).to.include('Region 1');
    expect(names).to.include('Region 2');
  });

  it('DELETE / should delete a region', async () => {
    const regions = await Region.create([
      {
        name: 'Region 1',
        type: 'Polygon',
        coordinates: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
      },
    ]);

    const idToDelete = regions[0]._id.toString();

    const res = await request(app)
      .delete(`/region/${idToDelete}`)
      .send();

    expect(res.status).to.equal(204);

    const regionAfterDelete = await Region.findById(idToDelete);
    expect(regionAfterDelete).to.be.equal(null);
  });

  it('UPDATE / should update a region', async () => {
    const region = await Region.create({
      name: 'Old Name',
      type: 'Polygon',
      coordinates: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
      ],
    });

    const updatedData = {
      name: 'New Name',
    };

    const res = await request(app)
      .put(`/region/${region._id.toString()}`)
      .send(updatedData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', 'New Name');

    const updatedRegion = await Region.findById(region._id);
    expect(updatedRegion?.name).to.equal('New Name');
  });
});
