/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie } from './models/movie.entity';
import { CreateMovieDto, FetchMovieDto, GetGeneralKpisDto, SaveMovieAwardImageCommand, UpdateMovieImageDto } from './models/movie.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
//   import { AuthGuard } from '@nestjs/passport';

@Controller('movies')
export class MoviessController {
  
  constructor(private _moviessService: MoviesService) {}

  @Get("fetchAllMovies")
  async fetchAllMovies() : Promise<{ movies: Movie[] }> {
    const allMovies = await this._moviessService.getAllMovies();
    return { movies: allMovies };
  }

  @Get("lastestMovies")
  async fetchLastestMovies() : Promise<{ movies: Movie[] }> {
    const lastestMovies = await this._moviessService.fetchLastestMovies();
    return { movies: lastestMovies };
  }

  @Get('getGeneralData')
  async GetGeneralData(): Promise<GetGeneralKpisDto> {
    const fetchedKpis = await this._moviessService.getGeneralKpi();
    return fetchedKpis;
  }

  @Get()
  // @UseGuards(AuthGuard())
  async getFilteredMovies(@Query() filterDto: FetchMovieDto): Promise<{ movies: Movie[] }> {
    const allMovies = await this._moviessService.getAllMoviesFiltered(filterDto);
    return { movies: allMovies };
  }

  @Get('/:movieId')
  async GetSpecificMovie(@Param('movieId') movieId: string): Promise<{movie: Movie, message: string}> {
    const fetchedMovie = await this._moviessService.getSpecificMovie(movieId);
    return {movie: fetchedMovie, message: 'movie fetched successfully'};
  }

  @Post('createMovie')
  async createMoviefile(@Body() createMovieDto: CreateMovieDto): Promise<{ createdMovieId: string , message: string}> {
    try {
      const createdMovieId = this._moviessService.insertMovie(createMovieDto);
      let message = 'movie created successfully';
      if((await createdMovieId).length <= 0){
        message = 'something went wrong'
      }
      return { createdMovieId: (await createdMovieId), message: message };
    } catch (error) {
      console.error('error', error);
      throw new ExceptionsHandler();
    }
  }

  @Post('insertMovieImage')
  async InsertMovieImage(@Body() updateMovieImageDto: UpdateMovieImageDto): Promise<{updatedMovieId: string, message: string}> {
    try {
      const updatedMovieId = this._moviessService.insertMovieImage(updateMovieImageDto);
      let message = 'movies image updated successfully';
      if((await updatedMovieId).length <= 0){
        message = 'something went wrong'
      }
      return { updatedMovieId: (await updatedMovieId), message };
    } catch (error) {
      console.error('error', error);
      throw new ExceptionsHandler();
    }
  }

  @Post('saveMovieAwardImage')
  async saveMovieAwardImage(@Body() saveMovieAwardImageCommand: SaveMovieAwardImageCommand): Promise<{updatedMovieId: string, message: string}> {
    try {
      const updatedMovieId = this._moviessService.saveMovieAwardImage(saveMovieAwardImageCommand);
      let message = 'movies award images updated successfully';
      if((await updatedMovieId).length <= 0){
        message = 'something went wrong'
      }
      return { updatedMovieId: (await updatedMovieId), message };
    } catch (error) {
      console.error('error', error);
      throw new ExceptionsHandler();
    }
  }

  @Patch('/:movieId')   
  async UpdateMovie(@Param('movieId') movieId: string, @Body() updateMovieDto: CreateMovieDto): Promise<{updatedMovieId: string, message: string}> {
    const updatedMovieId =  this._moviessService.updateMovie(movieId, updateMovieDto);
    let message = 'movie updated successfully';
      if((await updatedMovieId).length <= 0){
        message = 'something went wrong'
      }
      return { updatedMovieId: (await updatedMovieId), message };
  }
  
  @Delete('/:movieId')
  async DeleteMovie(@Param('movieId') movieId: string): Promise<boolean> {
    return this._moviessService.deleteMovie(movieId);

  }

  
}
