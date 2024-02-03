/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {type: String},
  link: {type: String},

  imagePath: {type: String},
  imageUrl: {type: String},
  createdDate: {type: Date},
  createdBy: {type: String},
  updatedDate: {type: Date},
  updatedBy: {type: String},
});
export interface Blog extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  link: string;

  imagePath: string;
  imageUrl: string;
  
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
}
