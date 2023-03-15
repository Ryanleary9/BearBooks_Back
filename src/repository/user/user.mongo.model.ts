import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.js';

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
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
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  kart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});

export const UserModel = model('User', userSchema, 'users');
