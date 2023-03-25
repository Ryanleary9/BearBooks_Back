import { Schema, model } from 'mongoose';
import { Manga } from '../../entities/manga.js';

const mangaSchema = new Schema<Manga>({
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  firstChap: [
    {
      type: String,
      required: true,
    },
  ],
});

mangaSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

export const MangaModel = model('Manga', mangaSchema, 'mangas');
