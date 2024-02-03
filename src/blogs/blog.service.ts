/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import { Blog } from './models/blog.entity';
import { CreateBlogDto } from './models/blog.model.dto';

export interface IBlogService {
  getAllBlogs(): Promise<Blog[]>;
  getSpecificBlog(blogId: string): Promise<Blog>;
  insertBlog(
    createBlogDto: CreateBlogDto,
    imageUrl: string,
    imagePath: string,
  ): Promise<string>;
  updateBlog(
    blogId: string,
    imageUrl: string,
    imagePath: string,
    updateBlogDto: CreateBlogDto,
  ): Promise<string>;
  deleteBlog(blogId: string): Promise<boolean>;
}

@Injectable()
export class BlogService implements IBlogService {
  constructor(@InjectModel('Blog') private readonly blogModel: Model<Blog>) {}
  async getAllBlogs(): Promise<Blog[]> {
    const blogs = await this.blogModel.find().exec();
    if (blogs.length == 0) {
      throw new NotFoundException('No movies found.');
    }
    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      description: blog.description,
      link: blog.link,
      imagePath: blog.imageUrl,
    })) as Blog[];
  }
  async getSpecificBlog(blogId: string): Promise<Blog> {
    const fetchedBlog = await this.specificBlog(blogId);
    return {
      id: fetchedBlog.id,
      title: fetchedBlog.title,
      description: fetchedBlog.description,
      link: fetchedBlog.link,
      imagePath: fetchedBlog.imageUrl,
    } as Blog;
  }
  public async insertBlog(
    createBlogDto: CreateBlogDto,
    imageUrl: string,
    imagePath: string,
  ): Promise<string> {
    try {
      const newBlog = new this.blogModel({
        title: createBlogDto.title,
        description: createBlogDto.description,
        status: createBlogDto.link,

        imagePath: imagePath,
        imageUrl: imageUrl,

        createdBy: createBlogDto.createdBy,
        createdDate: Date.now(),
        updatedBy: null,
        updatedDate: null,
      });
      const generatedBlogId = await newBlog.save();
      return generatedBlogId.id as string;
    } catch (error) {
      console.error('error', error);
      throw new BadRequestException('something went wrong');
    }
  }
  async updateBlog(
    blogId: string,
    imageUrl: string,
    imagePath: string,
    updateBlogDto: CreateBlogDto,
  ): Promise<string> {
    const fetchedBlog = await this.specificBlog(blogId);
    fetchedBlog.title = updateBlogDto.title;
    fetchedBlog.description = updateBlogDto.description;
    fetchedBlog.link = updateBlogDto.link;
    fetchedBlog.createdBy = updateBlogDto.createdBy;
    if (imagePath) {
      if (fs.existsSync(`files/${fetchedBlog.imagePath}`)) {
        try {
          // Delete the file
          await fs.unlinkSync(`files/${fetchedBlog.imagePath}`);
          // return { message: 'File deleted successfully' };
        } catch (error) {
          throw new BadRequestException(
            'exception when deleting the file',
            error,
          );
        }
      }
      fetchedBlog.imagePath = imagePath;
      fetchedBlog.imageUrl = imageUrl;
    }

    const updatedBlog = await fetchedBlog.save();
    return updatedBlog.id as string;
  }
  async deleteBlog(blogId: string): Promise<boolean> {
    const fetchedBlog = this.specificBlog(blogId);
    if (!fetchedBlog) {
      throw new BadRequestException('movie does not exist');
    }
    const fetchedBlogImagePath = (await fetchedBlog).imagePath;
    return await this.blogModel
      .deleteOne({ _id: blogId })
      .then((result) => {
        if (result.deletedCount > 0) {
          if (fs.existsSync(fetchedBlogImagePath)) {
            try {
              // Delete the file
              fs.unlinkSync(fetchedBlogImagePath);
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
  private async specificBlog(blogId: string): Promise<Blog> {
    let fetchedBlog;
    try {
      fetchedBlog = await this.blogModel.findById(blogId).exec();
    } catch (error) {
      throw new NotFoundException('Could not found blog.');
    }

    if (!fetchedBlog) {
      throw new NotFoundException('Could not found movie.');
    }
    return fetchedBlog;
  }
}
