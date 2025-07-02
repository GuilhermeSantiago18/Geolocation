import { expect } from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Region } from '../../models/Region/Region';
import app from '../../app';
import request from 'supertest';

describe('Region Model Unit Tests', function () {
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
    await Region.deleteMany({});
  });

  
  it('should create a region via POST /regions', async () => {
    const res = await request(app).post('/regions').send({
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
    expect(res.body).to.have.property('_id');
    expect(res.body.name).to.equal('Test Region');
    expect(res.body.coordinates).to.deep.equal([
        ['1', '0'],
        ['0', '1'],
        ['1', '1'],
        ['1', '0'],
      ])
  })
})