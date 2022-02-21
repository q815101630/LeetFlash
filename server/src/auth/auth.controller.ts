import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ResetPasswordDto } from './dtos/reset-password-dto';
import TokenVerificationDto from './dtos/token-verification';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Serialize(UserDto)
  @Post('/signup')
  async signUpUser(@Body() createUserDto: CreateUserDto, @Session() session) {
    const user = await this.authService.signup(createUserDto);
    session.user = user;
    return user;
  }

  @Serialize(UserDto)
  @HttpCode(200)
  @Post('/signin')
  async signInUser(@Body() loginUserDto: LoginUserDto, @Session() session) {
    const user = await this.authService.signIn(loginUserDto);
    console.log('user', user);
    session.user = user;
    return user;
  }
  @Post('/forget-password')
  async sendResetPasswordEmail(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.sendResetPasswordEmail(resetPasswordDto);
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
      session.user = user;
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
