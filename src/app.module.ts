import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { DatasetsModule } from './datasets/datasets.module'
import { ScrapperModule } from './scrapper/scrapper.module'

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URL}`, {
      connectionName: 'datasets'
    }),
    DatasetsModule,
    ScrapperModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MongooseModule]
})
export class AppModule {}
