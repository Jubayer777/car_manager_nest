import { Document } from 'mongoose';

export interface ICustomer extends Document {
  readonly name: string;
  readonly address: string;
  readonly phone: string;
}
