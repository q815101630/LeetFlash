import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Auth, google } from 'googleapis';
import { Source, User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ResetPasswordDto } from './dtos/reset-password-dto';

@Injectable()
export class AuthService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const clientID = this.configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async signIn(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        error: 'User credential invalid',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new NotFoundException({
        message: 'User credential failed',
        error: 'User credential invalid',
      });
    }
    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(createUserDto.password, saltRounds);
    createUserDto.password = hashedPassword;
    try {
      //Object.assign(createUserDto, { _id: new mongoose.Types.ObjectId() });
      const newUser = await this.usersService.create(createUserDto);
      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        console.log(error);
        throw new ConflictException(
          `User #${createUserDto.email} already exists`,
        );
      } else {
        throw new BadRequestException(error);
      }
    }
  }

  /**
   *  Sign up through google
   * @param email email
   * @returns user object
   */
  async googleSignUp(email: string) {
    const user = await this.usersService.create({
      email,
      source: Source.GOOGLE,
    } as CreateUserDto);

    return user;
  }

  async authenticateByGoogleToken(token: string): Promise<User> {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);

    const email = tokenInfo.email;
    try {
      const user = await this.usersService.findByEmailAndSource(
        email,
        Source.GOOGLE,
      );
      console.log('User login with Google', user.email);
      return user;
    } catch (err) {
      console.log('User sign up with Google', email);

      return await this.googleSignUp(email);
    }
  }

  //TODO
  async sendResetPasswordEmail(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }
}
