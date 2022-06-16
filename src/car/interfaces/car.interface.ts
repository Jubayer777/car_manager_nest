import mongoose, { Document } from 'mongoose';

export interface ICar extends Document {
  readonly brand: string;
  readonly color: string;
  readonly model: string;
  readonly user: string;
  readonly image: string;
  readonly photos: string[];
}
