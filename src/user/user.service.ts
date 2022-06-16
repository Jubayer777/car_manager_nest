import { UserDto } from './user.dto';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CarDto } from 'src/car/car.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

const mongoose = require('mongoose');

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  public async getUsers(): Promise<UserDto[]> {
    const users = await this.userModel.find().populate('cars').exec();
    if (!users || !users[0]) {
      throw new HttpException('Not Found', 404);
    }
    return users;
  }

  public async viewUsers(): Promise<UserDto[]> {
    const users = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'cars',
            localField: 'cars',
            foreignField: '_id',
            as: 'cars',
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            cars: {
              brand: 1,
            },
          },
        },
      ])
      .exec();
    if (!users || !users[0]) {
      throw new HttpException('Not Found', 404);
    }
    return users;
  }

  public async getUserById(_id: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ _id }).populate('cars').exec();
    if (!user) {
      throw new HttpException('Not Found', 404);
    }
    return user;
  }

  public async findUserById(_id: string) {
    const user = await this.userModel
      .aggregate([
        { $match: { _id: mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: 'cars',
            localField: 'cars',
            foreignField: '_id',
            as: 'cars',
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            cars: {
              brand: 1,
            },
          },
        },
      ])
      .exec();
    if (user.length < 1) {
      throw new HttpException('Not Found', 404);
    }
    return user;
  }

  public async signUpUser(response: Response, userData: UserDto) {
    const { password, ...rest } = userData;
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = {
      ...rest,
      password: hashedPass,
    };
    const user = await new this.userModel(newUser);
    const newRes = await user.save();
    const jwt = await this.jwtService.sign({ name: newRes.name });
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      token: jwt,
      message: 'signUp successful',
    };
  }

  public async loginUser(response: Response, userData: UserDto) {
    const loginUser = await this.userModel
      .findOne({ email: userData.email })
      .exec();

    if (loginUser) {
      const isValidUser = await bcrypt.compare(
        userData.password,
        loginUser.password,
      );
      if (isValidUser) {
        const jwt = await this.jwtService.sign({ name: loginUser.name });
        response.cookie('jwt', jwt, { httpOnly: true });
        return {
          token: jwt,
          message: 'login successful',
        };
      } else {
        throw new HttpException('Authentication error', 404);
      }
    } else {
      throw new HttpException('Authentication error', 404);
    }
  }

  public async logOutUser(response: Response) {
    response.cookie('jwt', { expires: new Date() });
    return 'Logout Successful';
  }
  public async deleteUserById(_id: string) {
    const user = await this.userModel.deleteOne({ _id }).exec();
    if (user.deletedCount === 0) {
      throw new HttpException('Not Found', 404);
    }
    return user;
  }

  public async putUserById(_id: string, newUser: UserDto): Promise<UserDto> {
    const user = await this.userModel
      .findOneAndUpdate({ _id }, newUser, { new: true })
      .populate('cars')
      .exec();
    if (!user) {
      throw new HttpException('Not Found', 404);
    }
    return user;
  }

  public async updateUserForCar(uId: string, carId: string) {
    const user = await this.userModel
      .findOneAndUpdate({ uId }, { $push: { cars: carId } }, { new: true })
      .exec();
    if (!user) {
      throw new HttpException('Not Found', 404);
    }
    return user;
  }
}
