import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperController } from './scrapper/scrapper.controller';
import { ScrapperService } from './scrapper/scrapper.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatasetsModule } from './datasets/datasets.module';
import { ScrapperModule } from './scrapper/scrapper.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest', {
      connectionName: 'datasets',
    }),
    DatasetsModule,
    ScrapperModule,
  ],
  controllers: [AppController, ScrapperController],
  providers: [AppService, ScrapperService],
})
export class AppModule {}
