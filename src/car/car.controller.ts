import { JwtGuard } from './../user/guards/jwt.guard';
import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CarDto } from './car.dto';
import { query } from 'express';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { of } from 'rxjs';
import { get } from 'http';
import { fileURLToPath } from 'url';
const fs = require('fs');

@Controller('car')
export class CarController {
  constructor(private carService: CarService) {}
  @UseGuards(JwtGuard)
  @Get()
  public getCars() {
    return this.carService.getCars();
  }

  @Get('/agr')
  public viewCars() {
    return this.carService.viewCars();
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 1 }, { name: 'photos' }],
      {
        storage: diskStorage({
          destination: async (req, file, callback) => {
            const dest =
              file.fieldname === 'image'
                ? './uploads/profileImages'
                : './uploads/multipleImages';
            callback(null, dest);
          },
          filename: async (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
          },
        }),
      },
    ),
  )
  public postCar(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; photos?: Express.Multer.File[] },
    @Body() body,
  ) {
    const { image, photos } = files;
    const fileImage = image && image[0];
    let newUser = { ...body };
    if (fileImage) {
      newUser = {
        ...body,
        image: fileImage.filename,
      };
    }
    if (photos) {
      const newPhotos = [];
      photos.forEach((photo) => {
        newPhotos.push(photo.filename);
      });
      newUser = {
        ...newUser,
        photos: newPhotos,
      };
    }
    return this.carService.postCar(newUser);
  }

  @Get(':id')
  public async getCarById(@Param('id') id: string) {
    return this.carService.getCarById(id);
  }

  @Get('/agr/:id')
  public async findCarById(@Param('id') id: string) {
    return this.carService.findCarById(id);
  }

  @Delete(':id')
  public async deleteCarById(@Param('id') id: string) {
    const car = await this.carService.getCarById(id);
    if (car.image) {
      fs.unlink('./uploads/profileImages/' + car.image, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    if (car.photos) {
      car.photos.map((d) => {
        fs.unlink('./uploads/multipleImages/' + d, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    }
    return this.carService.deleteCarById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'image', maxCount: 1 }, { name: 'photos' }],
      {
        storage: diskStorage({
          destination: async (req, file, callback) => {
            const dest =
              file.fieldname === 'image'
                ? './uploads/profileImages'
                : './uploads/multipleImages';
            callback(null, dest);
          },
          filename: async (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
          },
        }),
      },
    ),
  )
  public async putCarById(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; photos?: Express.Multer.File[] },
    @Param('id') id: string,
    @Body() body,
  ) {
    const { image, photos } = files;
    const fileImage = image && image[0];
    const car = await this.carService.getCarById(id);
    let newCar = { ...body };
    if (fileImage) {
      fs.unlink('./uploads/profileImages/' + car.image, (err) => {
        if (err) {
          console.log(err);
        }
      });
      newCar = { ...newCar, image: fileImage.filename };
    }
    if (photos) {
      const fArray = [...photos];
      const dArray = car.photos;
      let newArray = [];
      if (body.photos) {
        newArray = [...dArray];
        const bArray = [...body.photos];
        let fIndex = 0;
        dArray.map((d, i) => {
          if (!bArray.includes(d)) {
            newArray[i] = fArray[fIndex].filename;
            fIndex++;
            fs.unlink('./uploads/multipleImages/' + d, (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        });
        //done
        if (fIndex < fArray.length) {
          fArray.map((f, i) => {
            if (i >= fIndex) {
              newArray.push(f.filename);
            }
          });
        }
      } else {
        fArray.map((f) => newArray.push(f.filename));
        dArray.map((d) => {
          fs.unlink('./uploads/multipleImages/' + d, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      }
      newCar = {
        ...newCar,

        photos: newArray,
      };
    }
    return this.carService.putCarById(id, newCar);
  }
}
