// tests/region.controller.spec.ts
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import { Region } from '../../models/Region/Region';
import { IRegion } from '../../types/Region';

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


    it('should create a region', async () => {
    const res = await request(app)
      .post('/regions')
      .send({
        name: 'Test Region',
        type: 'Polygon',
        coordinates: [
          ['1', '0'],
          ['0', '1'],
          ['1', '1'],
          ['1', '0'],
        ],
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('name', 'Test Regions');
        });


  it('should list all regions', async () => {
    
  await Region.create([
    {
      name: 'Region 1',
      type: 'Polygon',
      coordinates: [
        ['0', '0'],
        ['0', '1'],
        ['1', '1'],
        ['1', '0'],
        ['0', '0'],
      ],
    },
    {
      name: 'Region 2',
      type: 'Polygon',
      coordinates: [
        ['1', '1'],
        ['1', '2'],
        ['2', '2'],
        ['2', '1'],
      ],
    },
  ]);

  const res = await request(app).get('/regions');

  expect(res.status).to.equal(200);
  expect(res.body).to.be.an('array');
  expect(res.body.length).to.be.at.least(2);


  const names = res.body.map((region: IRegion) => region.name);
  expect(names).to.include('Region 1');
  expect(names).to.include('Region 2');
});

 it('should delete a region', async () => {
  const regions = await Region.create([
    {
      name: 'Region 1',
      type: 'Polygon',
      coordinates: [
        ['0', '0'],
        ['0', '1'],
        ['1', '1'],
        ['1', '0'],
      ],
    },
  ]);


  const idToDelete = regions[0]._id.toString();


  const res = await request(app)
    .delete(`/regions/${idToDelete}`)
    .send();

  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('_id', idToDelete);

  const regionAfterDelete = await Region.findById(idToDelete);
  expect(regionAfterDelete).to.be.null;
});






})