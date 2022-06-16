import { BookingDto } from './booking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IBooking } from './interfaces/booking.interface';
import { Model } from 'mongoose';
import { Injectable, HttpException } from '@nestjs/common';
const mongoose = require('mongoose');

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking') private readonly bookingModel: Model<IBooking>,
  ) {}
  public async createBooking(newBooking: BookingDto): Promise<BookingDto> {
    const booking = await new this.bookingModel(newBooking);
    return booking.save();
  }

  public async getBookingByCustomer(customerId: string) {
    const booking = await this.bookingModel
      .find({ customer: customerId })
      .populate('car')
      .exec();
    if (!booking) {
      throw new HttpException('Not Found', 404);
    }
    return booking;
  }

  public async viewBookingByCustomer(customerId: string) {
    const booking = await this.bookingModel
      .aggregate([
        { $match: { customer: mongoose.Types.ObjectId(customerId) } },
        {
          $lookup: {
            from: 'cars',
            localField: 'car',
            foreignField: '_id',
            as: 'car',
          },
        },
        { $unwind: '$car' },
        {
          $project: {
            _id: 1,
            car: {
              _id: 1,
              brand: 1,
            },
          },
        },
      ])
      .exec();
    if (!booking) {
      throw new HttpException('Not Found', 404);
    }
    return booking;
  }

  public async getBookingByCar(carId: string) {
    const booking = await this.bookingModel
      .find({ car: carId })
      .populate('customer')
      .exec();
    if (!booking) {
      throw new HttpException('Not Found', 404);
    }
    return booking;
  }

  public async viewBookingByCar(carId: string) {
    const booking = await this.bookingModel
      .aggregate([
        { $match: { car: mongoose.Types.ObjectId(carId) } },
        {
          $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$customer' },
        {
          $project: {
            _id: 1,
            customer: {
              _id: 1,
              name: 1,
            },
          },
        },
      ])
      .exec();
    if (!booking) {
      throw new HttpException('Not Found', 404);
    }
    return booking;
  }
}
