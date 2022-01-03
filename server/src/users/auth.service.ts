import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
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
        error: { username: 'User credential invalid' },
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new NotFoundException({
        message: 'User credential failed',
        error: { username: 'User credential invalid' },
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
        throw new ConflictException(
          `User #${createUserDto.username} already exists`,
        );
      } else {
        throw new BadRequestException(error);
      }
    }
  }
}
