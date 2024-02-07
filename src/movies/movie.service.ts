/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './models/movie.entity';
import { CreateMovieDto, FetchMovieDto } from './models/movie.dto';
import * as fs from 'fs';
export interface IMoviesService {
  fetchLastestMovies(): Promise<Movie[]>;
  getAllMovies(movieDTO: FetchMovieDto): Promise<Movie[]>;
  getSpecificMovie(movieId: string): Promise<Movie>;
  insertMovie(createMovieDto: CreateMovieDto, imageUrl: string, imagePath: string): Promise<string>;
  updateMovie(movieId: string, imageUrl: string, imagePath: string, updateMovieDto: CreateMovieDto): Promise<string>;
  deleteMovie(movieId: string): Promise<boolean>;
}
@Injectable()
export class MoviesService implements IMoviesService {
  constructor(@InjectModel('Movie') private readonly movieModel: Model<Movie>) {}

  async fetchLastestMovies(): Promise<Movie[]>{
    const fetchedMovies = await this.movieModel.find().limit(4);
    return fetchedMovies;
  }
  async getAllMovies(movieDTO: FetchMovieDto): Promise<Movie[]> {
    const { movieStatus } = movieDTO;
    let movies;
    if(movieStatus && movieStatus.length > 0){
       movies = await this.movieModel.find({ status: { $in: movieStatus } }).exec();
    }else{
      //  movies = await this.movieModel.find((el)=> el.status.toLowerCase().includes(movieStatus.toLowerCase())).exec();
    }
    if (movies.length == 0) {
      throw new NotFoundException('No movies found.');
    }
    return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      story: movie.story,
      director: movie.director,
      coProducer: movie.coProducer,
      writer: movie.writer,
      associateProducer: movie.associateProducer,
      cast: movie.cast,
      contriesOfOrigin: movie.contriesOfOrigin,
      dop: movie.dop,
      releaseDate: movie.releaseDate,
      music: movie.music,
      runningTime: movie.runningTime,
      producer: movie.producer,
      status: movie.status,
      awards: movie.awards,
      imagePath: movie.imageUrl,
    })) as Movie[];
  }
  async getSpecificMovie(movieId: string): Promise<Movie> {
    const fetchedMovie = await this.specificMovie(movieId);
    return {
      id: fetchedMovie.id,
      title: fetchedMovie.title,
      story: fetchedMovie.story,
      director: fetchedMovie.director,
      coProducer: fetchedMovie.coProducer,
      writer: fetchedMovie.writer,
      associateProducer: fetchedMovie.associateProducer,
      cast: fetchedMovie.cast,
      contriesOfOrigin: fetchedMovie.contriesOfOrigin,
      dop: fetchedMovie.dop,
      releaseDate: fetchedMovie.releaseDate,
      music: fetchedMovie.music,
      runningTime: fetchedMovie.runningTime,
      producer: fetchedMovie.producer,
      status: fetchedMovie.status,
      awards: fetchedMovie.awards,
      imagePath: fetchedMovie.imageUrl,
    } as Movie;
  }
  public async insertMovie(
    createMovieDto: CreateMovieDto,
    imageUrl: string,
    imagePath: string,
  ): Promise<string> {
    try {
      const coProducersArray: string[] =
        createMovieDto.coProducer.split(/\s*,\s*/);
      const associateProducerArray: string[] =
        createMovieDto.associateProducer.split(/\s*,\s*/);
      const contriesOfOriginArray: string[] =
        createMovieDto.contriesOfOrigin.split(/\s*,\s*/);
      const castsArray: string[] = createMovieDto.cast.split(/\s*,\s*/);
      const producerArray: string[] = createMovieDto.producer.split(/\s*,\s*/);
      
      const newMovie = new this.movieModel({
        title: createMovieDto.title,
        story: createMovieDto.story,
        director: createMovieDto.director,
        coProducer: coProducersArray,
        writer: createMovieDto.writer,
        associateProducer: associateProducerArray,
        cast: castsArray,
        contriesOfOrigin: contriesOfOriginArray,
        dop: createMovieDto.dop,
        releaseDate: createMovieDto.releaseDate,
        music: createMovieDto.music,
        runningTime: createMovieDto.runningTime,
        producer: producerArray,
        status: createMovieDto.status,
        awards: createMovieDto.awards,

        imagePath: imagePath,
        imageUrl: imageUrl,
      });
      const generatedMovieId = await newMovie.save();
      return generatedMovieId.id as string;
    } catch (error) {
      console.error('error', error);
      throw new BadRequestException('something went wrong');
    }
  }
  async updateMovie(
    movieId: string,
    imageUrl: string,
    imagePath: string,
    updateMovieDto: CreateMovieDto,
  ): Promise<string> {
    const coProducersArray: string[] =
      updateMovieDto.coProducer.split(/\s*,\s*/);
    const associateProducerArray: string[] =
      updateMovieDto.associateProducer.split(/\s*,\s*/);
    const contriesOfOriginArray: string[] =
      updateMovieDto.contriesOfOrigin.split(/\s*,\s*/);
    const castsArray: string[] = updateMovieDto.cast.split(/\s*,\s*/);
    const producerArray: string[] = updateMovieDto.producer.split(/\s*,\s*/);

    const fetchedMovie = await this.specificMovie(movieId);
    fetchedMovie.title = updateMovieDto.title;
    fetchedMovie.story = updateMovieDto.story;
    fetchedMovie.director = updateMovieDto.director;
    fetchedMovie.coProducer = coProducersArray;
    fetchedMovie.writer = updateMovieDto.writer;
    fetchedMovie.associateProducer = associateProducerArray;
    fetchedMovie.cast = castsArray;
    fetchedMovie.contriesOfOrigin = contriesOfOriginArray;
    fetchedMovie.dop = updateMovieDto.dop;
    fetchedMovie.releaseDate = updateMovieDto.releaseDate;
    fetchedMovie.music = updateMovieDto.music;
    fetchedMovie.runningTime = updateMovieDto.runningTime;
    fetchedMovie.producer = producerArray;
    fetchedMovie.status = updateMovieDto.status;
    fetchedMovie.awards = updateMovieDto.awards;
    if (imagePath && imagePath.length > 0) {
      if (fs.existsSync(`files/${fetchedMovie.imagePath}`)) {
        try {
          // Delete the file
          await fs.unlinkSync(`files/${fetchedMovie.imagePath}`);
          // return { message: 'File deleted successfully' };
        } catch (error) {
          throw new BadRequestException(
            'exception when deleting the file',
            error,
          );
        }
      }
      fetchedMovie.imagePath = imagePath;
      fetchedMovie.imageUrl = imageUrl;
    }

    const updatedMovie = await fetchedMovie.save();
    return updatedMovie.id as string;
  }
  async deleteMovie(movieId: string): Promise<boolean> {
    const fetchmovie = this.specificMovie(movieId);
    if (!fetchmovie) {
      throw new BadRequestException('movie does not exist');
    }
    const fetchedMovieImagePath = (await fetchmovie).imagePath;
    return await this.movieModel
      .deleteOne({ _id: movieId })
      .then((result) => {
        if (result.deletedCount > 0) {
          if (fs.existsSync(fetchedMovieImagePath)) {
            try {
              // Delete the file
              fs.unlinkSync(fetchedMovieImagePath);
              // return { message: 'File deleted successfully' };
            } catch (error) {
              throw new BadRequestException(
                'exception when deleting the file',
                error,
              );
            }
          }
          return true;
        } else {
          throw new BadRequestException('something went wrong.');
        }
      })
      .catch((error) => {
        console.error('error', error);
        throw new BadRequestException('something went wrong.');
      });
  }
  private async specificMovie(movieId: string): Promise<Movie> {
    let fetchedMovie;
    try {
      fetchedMovie = await this.movieModel.findById(movieId).exec();
    } catch (error) {
      throw new NotFoundException('Could not found movie.');
    }

    if (!fetchedMovie) {
      throw new NotFoundException('Could not found movie.');
    }
    return fetchedMovie;
  }
}
