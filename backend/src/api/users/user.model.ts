import mongoose, { Document, Schema } from 'mongoose';
import { User as SharedUser } from '@tesla/shared';

// Extends strictly mapping the Monorepo Types safely aligning them perfectly towards Mongoose attributes
export interface IUser extends SharedUser, Document {}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    language: {
      type: String,
      default: 'en',
    },
    theme: {
      type: String,
      default: 'light',
    },
    sites: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        devices: [
          {
            id: { type: String, required: true },
            type: { type: String, required: true },
            x: { type: Number, required: true },
            y: { type: Number, required: true },
          }
        ],
        updatedAt: { type: Date, default: Date.now },
      }
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.set('toJSON', {
  transform: (document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
