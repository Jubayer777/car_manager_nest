const mongoose = require('mongoose');
import { UserController } from './../user/user.controller';
import { HttpException, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ICar } from './interfaces/car.interface';
import { CarDto } from './car.dto';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
@Injectable()
export class CarService {
  constructor(
    @InjectModel('Car') private readonly carModel: Model<ICar>,
    private userService: UserService,
  ) {}

  public async getCars(): Promise<CarDto[]> {
    const cars = await this.carModel.find().populate('user').exec();
    if (!cars || !cars[0]) {
      throw new HttpException('Not Found', 404);
    }
    return cars;
  }

  public async viewCars(): Promise<CarDto[]> {
    const cars = await this.carModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            brand: 1,
            user: {
              name: 1,
            },
          },
        },
      ])
      .exec();
    if (!cars || !cars[0]) {
      throw new HttpException('Not Found', 404);
    }
    return cars;
  }

  public async postCar(newCar: CarDto): Promise<CarDto> {
    const car = await new this.carModel(newCar);
    const newRes = car.save();
    const id = newCar.user;
    if (newRes) {
      const user = this.userService.updateUserForCar(id, (await newRes)._id);
      if (!user) {
        throw new HttpException('Not Found', 404);
      }
      return newRes;
    } else {
      throw new HttpException('Not Found', 404);
    }
  }

  public async getCarById(_id: string): Promise<CarDto> {
    const car = await this.carModel.findOne({ _id }).populate('user').exec();
    if (!car) {
      throw new HttpException('Not Found', 404);
    }
    return car;
  }

  public async findCarById(id: string) {
    const car = await this.carModel
      .aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            brand: 1,
            user: {
              name: 1,
            },
          },
        },
      ])
      .exec();
    if (car.length < 1) {
      throw new HttpException('Not Found', 404);
    } else {
      return car[0];
    }
  }

  public async deleteCarById(_id: string) {
    const car = await this.carModel.deleteOne({ _id }).exec();
    if (car.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    }
    return car;
  }

  public async putCarById(_id: string, newCar: any): Promise<CarDto> {
    const car = await this.carModel
      .findOneAndUpdate({ _id }, newCar, { new: true })
      .populate('user')
      .exec();
    if (!car) {
      throw new HttpException('Not Found', 404);
    }
    return car;
  }
}
