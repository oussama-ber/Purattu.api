/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  // Header,
  Post,
  Get,
  // Req,
  // UploadedFile,
  // UseInterceptors,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogImageDto } from './models/blog.model.dto';
import { Blog } from './models/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(private _blogService: BlogService) {}
  @Get()
  async getAllBlogs(): Promise<{ blogs: Blog[] }> {
    const allblogs = await this._blogService.getAllBlogs();
    return { blogs: allblogs };
  }
  @Get('/:blogId')
  async GetSpecificBlog(
    @Param('blogId') blogId: string,
  ): Promise<{ blog: Blog; message: string }> {
    const fetchedMovie = await this._blogService.getSpecificBlog(blogId);
    return { blog: fetchedMovie, message: 'blog fetched successfully' };
  }
  @Post('createBlog')
  async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<{ blogId: string; message: string }> {
    try {
      const createBlogResponseId = this._blogService.insertBlog(createBlogDto);
      let message = 'blog created successfully';
      if ((await createBlogResponseId).length <= 0) {
        message = 'something went wrong';
      }
      return { blogId: await createBlogResponseId, message: message };
    } catch (error) {
      console.error('error', error);
      throw new ExceptionsHandler();
    }
  }
  @Post('insertBlogImage')
  async InsertMovieImage(@Body() updateBlogImageDto: UpdateBlogImageDto): Promise<{updatedBlogId: string, message: string}> {
    try {
      const updatedBlogId = this._blogService.insertBlogImage(updateBlogImageDto);
      let message = 'blogs image updated successfully';
      if((await updatedBlogId).length <= 0){
        message = 'something went wrong'
      }
      return { updatedBlogId: (await updatedBlogId), message };
    } catch (error) {
      console.error('error', error);
      throw new ExceptionsHandler();
    }
  }
  @Patch('/:blogId')
  async UpdateBlog(@Param('blogId') blogId: string, @Body() updateBlogDto: CreateBlogDto): Promise<{ updatedBlogId: string; message: string }> {
    const updatedBlogId = this._blogService.updateBlog(blogId, updateBlogDto);
    let message = 'blog updated successfully';
    if ((await updatedBlogId).length <= 0) {
      message = 'something went wrong';
    }
    return { updatedBlogId: await updatedBlogId, message };
  }

  @Delete('/:blogId')
  async DeleteBlog(@Param('blogId') blogId: string): Promise<boolean> {
    return this._blogService.deleteBlog(blogId);
  }
}
