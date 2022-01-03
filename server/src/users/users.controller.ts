import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard, SuperUserAuthGuard } from 'src/guards/auth.guard';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('api/users')
@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async signUpUser(@Body() createUserDto: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(createUserDto);
    session.user = user;
    return user;
  }

  @Post('/signin')
  async signInUser(@Body() loginUserDto: LoginUserDto, @Session() session) {
    const user = await this.authService.signIn(loginUserDto);
    console.log(user);
    session.user = user;
    return user;
  }

  @Post('/signout')
  async signOutUser(@Session() session) {
    session.user = null;
  }

  @UseGuards(LocalAuthGuard)
  @Get('/profile')
  getMe(@Req() req) {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Patch('/profiles/')
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.updateByUsername(req.user.username, updateUserDto);
  }

  @UseGuards(SuperUserAuthGuard)
  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  // TODO: Super user has not been implemented yet, so no one can access this
  @UseGuards(SuperUserAuthGuard)
  @Get('/profiles/:username')
  getUserByUsername(@Param('username') username: string) {
    if (!username) {
      throw new NotFoundException('Username does not exist');
    }
    const user = this.usersService.findByUsername(username);

    return user;
  }
  @UseGuards(SuperUserAuthGuard)
  @Patch('/profiles/:username')
  updateByUsername(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateByUsername(username, updateUserDto);
  }
  @UseGuards(SuperUserAuthGuard)
  @Delete('/profiles/:id')
  removeByUsername(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
