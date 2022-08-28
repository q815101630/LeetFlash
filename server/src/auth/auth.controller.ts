import { UsersService } from './../user/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';

import EmailService from 'src/email/email.service';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ResetPasswordDto } from './dtos/reset-password-dto';
import TokenVerificationDto from './dtos/token-verification';
import { UserDto } from './dtos/user.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly EmailService: EmailService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Serialize(UserDto)
  @Post('/signup')
  async signUpUser(@Body() createUserDto: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(createUserDto);
    delete user.password;
    session.user = user;
    return user;
  }

  @Serialize(UserDto)
  @HttpCode(200)
  @Post('/signin')
  async signInUser(@Body() loginUserDto: LoginUserDto, @Session() session) {
    const user = await this.authService.signIn(loginUserDto);
    console.log('user', user.email);
    delete user.password;
    session.user = user;
    return user;
  }
  @Post('/forget-password')
  async sendResetPasswordEmail(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.sendResetPasswordEmail(resetPasswordDto);
  }

  @Post('/signout')
  async signOut(@Session() session) {
    session.user = null;
  }

  @Serialize(UserDto)
  @Post('google-auth')
  async authenticateGoogle(
    @Body() tokenData: TokenVerificationDto,
    @Session() session,
  ) {
    try {
      const user = await this.authService.authenticateByGoogleToken(
        tokenData.token,
      );
      delete user.password;
      session.user = user;
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify-api-token')
  async verifyApiToken(@Body() tokenData: TokenVerificationDto) {
    try {
      const user = await this.usersService.findOne(tokenData.token);
      if (!user) {
        throw new BadRequestException('Invalid token');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('generate-api-token')
  async sendApiToken(@Req() request) {
    try {
      const userId = request.user.id;
      return userId;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
