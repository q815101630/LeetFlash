import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { Source, User } from './entities/user.entity';
import { UsersService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
      console.log('signup 1231 123');
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

  async googleSignUp(req) {
    //req.user is already attached to the request by passport
    if (!req.user) {
      throw new BadRequestException('Google Sign in failed');
    }

    const { email, firstName, lastName, picture } = req.user;
    const user = await this.usersService.create({
      email,
      source: Source.GOOGLE,
    } as CreateUserDto);
    return user;
  }
}
