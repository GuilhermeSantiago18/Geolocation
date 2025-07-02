import { expect } from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {Region} from './Region';

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

  it('should create a region successfully', async () => {
    const regionData = {
      name: 'Test Region',
      type: 'Polygon',
        coordinates:
          [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 0],

          ]
        
    };

    const region = new Region(regionData);
    const savedRegion = await region.save();


    expect(savedRegion._id).to.exist;
    expect(savedRegion.name).to.equal('Test Region');
    expect(savedRegion.type).to.equal('Polygon');
    expect(savedRegion.coordinates[0]).to.have.lengthOf(4)
    expect(savedRegion.coordinates[0]).to.deep.equal([
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 0],
          ])
  });

  it('should fail validation if name is missing', async () => {
    const region = new Region({
      name: null,
      type: 'Polygon',
      coordinates: [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0]
        ]
      }
    );

    let error = null;
    try {
      await region.validate();
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.errors).to.have.property('name');
  });

  it('should fail validation if coordinates are missing', async () => {
    const region = new Region({
      name: 'Test Region',
      type: 'Polygon',
      coordinates: null
      }
    );

    let error = null;
    try {
      await region.validate();
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.errors).to.have.property('coordinates');
  });

});
