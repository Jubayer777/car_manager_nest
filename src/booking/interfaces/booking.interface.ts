import { Document } from 'mongoose';

export interface IBooking extends Document {
  readonly customer: string;
  readonly car: string;
}
