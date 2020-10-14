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

    service = module.get<DatasetsService>(DatasetsService);

    jest.useFakeTimers();
  });

  afterEach((done) => {
    service.clearDb();
    done();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateDataset', () => {
    it('should refuse null a object', async () => {
      let result = await service.createOrUpdateDataset(null).then((result) => {
        return result;
      });
      expect(result).toBeFalsy();
    });

    it('should create unexisting dataset', async () => {
      let datasetId = await service.createOrUpdateDataset(datasetMock).then((dataset) => {
        return dataset!.id;
      });
      let savedDataset = await service.findById(datasetId).then((dataset) => {
        return dataset!;
      });

      expect(savedDataset.name).toEqual(datasetMock.name);
    });

    it('should update existing dataset', async () => {
      let datasetId = await service.createOrUpdateDataset(datasetMock).then((dataset) => {
        return dataset!.id;
      });

      let alteredDatasetMock = _.cloneDeep(datasetMock);
      alteredDatasetMock['description'] = 'new description';
      await service.createOrUpdateDataset(alteredDatasetMock);

      let updatedDataset = await service.findById(datasetId).then((dataset) => {
        return dataset!;
      });

      expect(updatedDataset.description).toEqual('new description');
    });
  });
});
