/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
export class CreateBlogDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  link: string;
  createdBy: string;
}
