import mongoose, { Document, Schema } from 'mongoose';
import { SiteLayout } from '@tesla/shared';

export interface ISite extends Omit<SiteLayout, 'id'>, Document {
  ownerUsername: string;
}

const siteSchema: Schema = new Schema(
  {
    _id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
    ownerUsername: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Untitled Site',
    },
    devices: [
      {
        id: { type: String, required: true },
        type: { type: String, required: true },
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      }
    ],
  },
  {
    timestamps: true,
  }
);

siteSchema.set('toJSON', {
  transform: (document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Site = mongoose.model<ISite>('Site', siteSchema);
export default Site;
