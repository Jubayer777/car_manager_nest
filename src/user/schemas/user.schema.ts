import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  password: String,
  phone: String,
  cars: [{ type: mongoose.Types.ObjectId, ref: 'Car' }],
});
