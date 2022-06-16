import { BookingService } from './booking.service';
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { BookingDto } from './booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  public booking(@Body() booking: BookingDto) {
    return this.bookingService.createBooking(booking);
  }

  @Get('/customer/:customerId')
  public async getBookingByCustomer(@Param('customerId') customerId: string) {
    return this.bookingService.getBookingByCustomer(customerId);
  }

  @Get('/agr/customer/:customerId')
  public async viewBookingByCustomer(@Param('customerId') customerId: string) {
    return this.bookingService.viewBookingByCustomer(customerId);
  }

  @Get('/car/:carId')
  public async getBookingByCar(@Param('carId') carId: string) {
    return this.bookingService.getBookingByCar(carId);
  }

  @Get('/agr/car/:carId')
  public async viewBookingByCar(@Param('carId') carId: string) {
    return this.bookingService.viewBookingByCar(carId);
  }
}
