import { JwtGuard } from './guards/jwt.guard';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get()
  public getUsers() {
    return this.userService.getUsers();
  }

  @Get('/agr')
  public viewUsers() {
    return this.userService.viewUsers();
  }

  @Get(':id')
  public async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('/agr/:id')
  public async findUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Post('/signUp')
  public signUpUser(
    @Res({ passthrough: true }) response: Response,
    @Body() user: UserDto,
  ) {
    return this.userService.signUpUser(response, user);
  }

  @Post('/login')
  public loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body() user: UserDto,
  ) {
    return this.userService.loginUser(response, user);
  }
  @UseGuards(JwtGuard)
  @Post('/signOut')
  public logOutUser(@Res({ passthrough: true }) response: Response) {
    return this.userService.logOutUser(response);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteUserById(@Param('id') id: string) {
    return this.userService.deleteUserById(id);
  }
  @UseGuards(JwtGuard)
  @Put(':id')
  public async putUserById(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.putUserById(id, user);
  }
}
