import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.js';

const userSchema = new Schema<User>(
  {
    id: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    passwd: {
      type: String,
      required: true,
    },
    pfp: {
      type: String,
    },
    role: {
      type: String,
    },
    surname: {
      type: String,
    },
    kart: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Manga',
      },
    ],
  },
  { strict: false }
);

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});

export const UserModel = model('User', userSchema, 'users');
