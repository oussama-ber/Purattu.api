/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './models/movie.entity';
import { MoviessController } from './movie.controller';
import { MoviesService } from './movie.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MongooseModule.forFeature(
          [{name: 'Movie', schema: MovieSchema}]
        ),
        MulterModule.register({dest: './uploads'})
      ],
  controllers: [MoviessController],
  providers: [MoviesService],
})
export class MoviesModule {}
