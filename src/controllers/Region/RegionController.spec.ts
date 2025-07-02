// tests/region.controller.spec.ts
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';

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


})