import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { ICustomer } from './interfaces/customer.interface';
import { Model } from 'mongoose';
import { CustomerDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<ICustomer>,
  ) {}

  public async createCustomer(newCustomer: CustomerDto): Promise<CustomerDto> {
    const customer = await new this.customerModel(newCustomer);
    return customer.save();
  }
}
