import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { BookingModule } from './booking/booking.module';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MulterModule.register({ dest: '' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', ''),
    }),
    CarModule,
    UserModule,
    CustomerModule,
    BookingModule,
  ],
})
export class AppModule {}
