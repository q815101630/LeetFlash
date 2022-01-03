import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
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
}
