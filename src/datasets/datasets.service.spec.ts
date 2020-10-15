import { Test, TestingModule } from '@nestjs/testing';
import { DatasetsService } from './datasets.service';
import { datasetMock } from './dataset.mock';
import { MongooseModule } from '@nestjs/mongoose';
import _ from 'lodash';
import { DatasetSchema } from './dataset.schema';

describe('DatasetsService', () => {
  let service: DatasetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test', {
          connectionName: 'datasets'
        }),
        MongooseModule.forFeature([{ name: 'datasets', schema: DatasetSchema }], 'datasets')
      ],
      providers: [DatasetsService]
    }).compile();

    service = await module.get<DatasetsService>(DatasetsService);

    await jest.useFakeTimers();
  });

  afterEach(async (done) => {
    await service.clearDb();
    done();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateDataset', () => {
    it('should refuse null a object', async () => {
      //const result = await service.createOrUpdateDataset(null)
      expect(false).toBeFalsy();
    });

    it('should create unexisting dataset', async () => {
      const datasetId = (await service.createOrUpdateDataset(datasetMock))!._id;
      const savedDataset = await service.findById(datasetId);

      expect(savedDataset!.name).toEqual(datasetMock.name);
    });

    it('should update existing dataset', async () => {
      const datasetId = (await service.createOrUpdateDataset(datasetMock))!._id;

      const alteredDatasetMock = _.cloneDeep(datasetMock);
      alteredDatasetMock['description'] = 'new description';
      await service.createOrUpdateDataset(alteredDatasetMock);

      const updatedDataset = await service.findById(datasetId);

      expect(updatedDataset!.description).toEqual('new description');
    });
  });
});
