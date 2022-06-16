import * as mongoose from 'mongoose';

export const BookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Types.ObjectId, ref: 'Customer' },
  car: { type: mongoose.Types.ObjectId, ref: 'Car' },
});
