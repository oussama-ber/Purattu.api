/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './models/blog.entity';
import { BlogsController } from './blog.controller';

@Module({
    imports:[
        MongooseModule.forFeature(
            [{name: 'Blog', schema: BlogSchema}]
          ),
    ],
    controllers: [BlogsController],
    providers: [BlogService],
})
export class BlogModule {};