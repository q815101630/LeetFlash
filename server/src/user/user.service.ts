import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Source, User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { defaultStages } from 'src/utils/constant';
import * as mongoose from 'mongoose';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('Creating user');
    try {
      return await this.userModel.create({
        ...createUserDto,
        total_stages: defaultStages,
        source: createUserDto.source ? createUserDto.source : Source.WEB,
      });
    } catch (err) {
      throw err;
    }
  }

  async findOne(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User #${userId} does not exist`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }

  async findByEmailAndSource(email: string, source: Source): Promise<User> {
    const user = await this.userModel.findOne({ email, source }).exec();
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException(`User #${username} not found`);
    }
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      { _id: userId },
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User #${userId} not found`);
    }
    return existingUser;
  }

  async updateByUsername(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (updateUserDto.password) {
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(
        updateUserDto.password,
        saltRounds,
      );
      updateUserDto.password = hashedPassword;
    }

    const existingUser = await this.userModel.findOneAndUpdate(
      { username },
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User #${username} not found`);
    }
    return existingUser;
  }

  async remove(userId: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndRemove(userId);
    return deletedUser;
  }

  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    var user = await this.userModel.findOne({ email: email });
    console.log(`Found user ${user.email}`)
    if (!user)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    const saltRounds = 10;
    let password = await bcrypt.hashSync(newPassword, saltRounds);
    await this.userModel.findOneAndUpdate(
      { email: email },
      { password: password },
    );
    return true;
  }
}
