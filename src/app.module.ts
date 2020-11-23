import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { DatasetsModule } from './datasets/datasets.module'
import { ScrapperModule } from './scrapper/scrapper.module'

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://hordor:${process.env.MONGO_PWD}@cluster0.ji2jv.mongodb.net/datasets?retryWrites=true&w=majority`, {
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
