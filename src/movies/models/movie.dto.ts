/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsOptional  } from 'class-validator';
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
export class FetchMovieDto {
  @IsOptional()
  movieStatus: string;
}