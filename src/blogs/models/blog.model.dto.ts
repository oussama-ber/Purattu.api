/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateBlogDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  link: string;
  createdBy: string;
}
export class UpdateBlogImageDto {
  @IsString()
  blogId: string;
  @IsString()
  imageUrl: string;
}
