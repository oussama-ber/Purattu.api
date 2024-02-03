/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MoviesService } from './movie.service';
import { Movie } from './models/movie.entity';
import { CreateMovieDto } from './models/movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
//   import { MoviesService } from './product.service';
//   import { CreateProductDto, FetchProductDto, UpdateProductDto } from './models/product.dto';
//   import { Product } from './models/product.model';
//   import { AuthGuard } from '@nestjs/passport';

@Controller('movies')
export class MoviessController {
  constructor(private _moviessService: MoviesService) {}
  // @Get()
  // async getFetchProducts(@Query() filterDto: FetchProductDto) : Promise<Product[]>{
  //   const products = await this._productsService.fetchProducts(filterDto);
  //   return products;
  // }
  @Get()
  // @UseGuards(AuthGuard())
  async getAllMovies(): Promise<{ movies: Movie[] }> {
    const allMovies = await this._moviessService.getAllMovies();
    return { movies: allMovies };
  }
  @Get('/:movieId')
  async GetSpecificMovie(@Param('movieId') movieId: string): Promise<{movie: Movie, message: string}> {
    const fetchedMovie = await this._moviessService.getSpecificMovie(movieId);
    return {movie: fetchedMovie, message: 'movie fetched successfully'};
  }
  // @Post()
  // async CreatMovie(@Body() createTaskDto: CreateMovieDto): Promise<string> {
  //   return this._moviessService.insertMovie(createTaskDto);
  // }
  @Post('uploadfiletest')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}.${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadfiletest(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return file.originalname;
  }

  @Post('createMovie')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          // Get the name without extension
          const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");

          const name = fileNameWithoutExt.toLowerCase().split(" ").join("-");
          const filename = `${name}-${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @Header('Content-Type', 'text/plain') // Set the Content-Type header to text/plain
  async createMoviefiletest(
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<{ filename: string , message: string}> {
    try {
      const url = `${request.protocol}://${request.get('host')}`;
      const imageUrl = url + "/images/" + file.filename;
      const test = this._moviessService.insertMovie(createMovieDto, imageUrl, file.filename);
      let message = 'movie created successfully';
      if((await test).length <= 0){
        message = 'something went wrong'
      }
      return { filename: file.originalname, message: message };
    } catch (error) {
      console.error('error', error);
      throw new ExceptionsHandler();
    }
  }

  @Patch('/:movieId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          // Get the name without extension
          const fileNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");

          const name = fileNameWithoutExt.toLowerCase().split(" ").join("-");
          const filename = `${name}-${Date.now()}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async UpdateMovie(@Req() request,@Param('movieId') movieId: string,@UploadedFile() file: Express.Multer.File, @Body() updateMovieDto: CreateMovieDto): Promise<string> {
    let filename = "";
    if(file){
      filename = file.filename;
    }
    const url = `${request.protocol}://${request.get('host')}`;
    const imageUrl = url + "/images/" + file.filename;
    return this._moviessService.updateMovie(movieId, imageUrl, filename, updateMovieDto);
  }
  @Delete('/:movieId')
  async DeleteMovie(@Param('movieId') movieId: string): Promise<boolean> {
    return this._moviessService.deleteMovie(movieId);

  }
}
