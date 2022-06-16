import { CustomerService } from './customer.service';
import { Controller, Post, Body } from '@nestjs/common';
import { CustomerDto } from './customer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Post()
    public postCar(@Body() customer:CustomerDto){
        return this.customerService.createCustomer(customer);
    }
}
