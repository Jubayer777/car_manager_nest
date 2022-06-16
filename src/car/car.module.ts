import { UserModule } from './../user/user.module';
import { UserService } from 'src/user/user.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CarSchema } from './schemas/car.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Car',
        schema: CarSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
