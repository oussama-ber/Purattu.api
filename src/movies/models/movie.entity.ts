/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
export const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  story: {type: String},
  director: {type: String},
  coProducer: [{type: String}],
  writer: {type: String},
  associateProducer: [{type: String}],
  cast: [{type: String}],
  contriesOfOrigin: [{type: String}],
  dop: {type: String},
  releaseDate: {type: Number},
  music: {type: String},
  runningTime: {type: Number},
  producer: [{type: String}],
  awards: [{type: String}],
  status: {type: String},
  imagePath: {type: String},
  imageUrl: {type: String},
});
export interface Movie extends mongoose.Document {
  id: string;
  title: string;
  story: string;
  director: string;
  coProducer: string[],
  writer: string;
  associateProducer: string[]
  cast: string[],
  contriesOfOrigin: string[]
  dop: string;
  releaseDate: number,
  music: string;
  runningTime: number,
  producer: string[]
  awards: string[]
  status: string;
  imagePath: string;
  imageUrl: string;
}
