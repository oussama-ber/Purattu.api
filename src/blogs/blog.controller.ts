/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Header,
    Post,
    Get,
    Req,
    UploadedFile,
    UseInterceptors,
    Param,
    Patch,
    Delete
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './models/blog.model.dto';
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
    async GetSpecificBlog(@Param('blogId') blogId: string): Promise<{blog: Blog, message: string}> {
      const fetchedMovie = await this._blogService.getSpecificBlog(blogId);
      return {blog: fetchedMovie, message: 'blog fetched successfully'};
    }  
    @Post('createBlog')
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
    async createBlog(
      @Req() request,
      @UploadedFile() file: Express.Multer.File,
      @Body() createBlogDto: CreateBlogDto,
    ): Promise<{ filename: string , message: string}> {
      try {
        const url = `${request.protocol}://${request.get('host')}`;
        const imageUrl = url + "/images/" + file.filename;
        const createBlogResponse = this._blogService.insertBlog(createBlogDto, imageUrl, file.filename);
        let message = 'blog created successfully';
        if((await createBlogResponse).length <= 0){
          message = 'something went wrong'
        }
        return { filename: file.originalname, message: message };
      } catch (error) {
        console.error('error', error);
        throw new ExceptionsHandler();
      }
    }
  
    @Patch('/:blogId')
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
    async UpdateBlog(@Req() request,@Param('blogId') blogId: string,@UploadedFile() file: Express.Multer.File, @Body() updateBlogDto: CreateBlogDto): Promise<string> {
      let filename = "";
      if(file){
        filename = file.filename;
      }
      const url = `${request.protocol}://${request.get('host')}`;
      const imageUrl = url + "/images/" + file.filename;
      return this._blogService.updateBlog(blogId, imageUrl, filename, updateBlogDto);
    }
    
    @Delete('/:blogId')
    async DeleteBlog(@Param('blogId') blogId: string): Promise<boolean> {
      return this._blogService.deleteBlog(blogId);
  
    }
  }
  