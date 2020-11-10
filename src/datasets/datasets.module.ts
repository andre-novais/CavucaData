import { Module } from '@nestjs/common'
import { DatasetsController } from './datasets.controller'
import { DatasetsService } from './datasets.service'
import { MongooseModule } from '@nestjs/mongoose'
import { DatasetSchema } from './dataset.schema'
import { ElasticSearchService } from './elasticsearch.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'datasets', schema: DatasetSchema }], 'datasets')],
  controllers: [DatasetsController],
  providers: [DatasetsService, ElasticSearchService],
  exports: [MongooseModule, DatasetsService]
})
export class DatasetsModule {}
