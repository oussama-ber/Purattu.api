/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray  } from 'class-validator';
export class CreateMovieDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  story: string;
  @IsNotEmpty()
  director: string;
  @IsNotEmpty()
  coProducer: string;
  @IsNotEmpty()
  writer: string;
  associateProducer: string;
  cast: string;
  contriesOfOrigin: string;
  dop: string;
  releaseDate: number;
  music: string;
  runningTime: number;
  producer: string;
  status: string;
  awards: string[];
}
export class UpdateProductDto {
  @IsNotEmpty()
  id: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  price: number;
}
export class UpdateMovieImageDto {
  @IsString()
  movieId: string;
  @IsString()
  imageUrl: string;
}
export class SaveMovieAwardImageCommand {
  @IsString()
  movieId: string;
  @IsArray()
  awardImageUrls: string[];
}
export class FetchMovieDto {
  @IsOptional()
  movieStatus: string;
}
export class GetGeneralKpisDto {
  @IsNumber()
  projects: number;
  
  @IsNumber()
  featureMovies: number;
}