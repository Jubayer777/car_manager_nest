import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  readonly address: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly cars: string[];
}
