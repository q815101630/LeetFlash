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
  Headers,
  HttpCode,
  Res,
  Header,
} from '@nestjs/common';
import { LocalAuthGuard, SuperUserAuthGuard } from 'src/guards/auth.guard';

import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { QuestionService } from 'src/question/question.service';
import { SubmitQuestionDto } from 'src/question/dto/submit-question.dto';
import { Question } from 'src/question/entities/question.entity';
import { CardService } from 'src/card/card.service';
import { AuthGuard } from '@nestjs/passport';
import { Source } from './entities/user.entity';

@ApiTags('api/user')
@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private questionService: QuestionService,
    private cardService: CardService,
  ) {}
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
    console.log(user);
    session.user = user;
    return user;
  }

  @Post('/signin-return-id')
  async signInAndReturnId(
    @Body() loginUserDto: LoginUserDto,
    @Session() session,
  ) {
    const user = await this.authService.signIn(loginUserDto);
    session.user = user;
    return { id: user._id.toString(), email: user.email };
  }

  @Post('/signout')
  async signOutUser(@Session() session) {
    session.user = null;
  }

  // Google Oauth Entry Point
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Session() session) {
    const { email } = req.user;

    const user = await this.usersService
      .findByEmailAndSource(email, Source.GOOGLE)
      .catch(() => {
        console.log('sign up a new google user');
      });
    if (user) {
      session.user = user;
      console.log('User used to login with Google', user.email);
      return user;
    }
    const newUser = this.authService.googleSignUp(req);
    session.user = newUser;
    return newUser;
  }

  @Serialize(UserDto)
  @UseGuards(LocalAuthGuard)
  @Get('/profile')
  getMe(@Req() req) {
    console.log(req.user);
    return req.user;
  }
  @Serialize(UserDto)
  @UseGuards(LocalAuthGuard)
  @Patch('/profile/')
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

  @Post('/add-question/:email')
  async submitQuestion(
    @Param('email') email: string,
    @Headers('UUID') uuid: string,
    @Body() submitQuestionDto: SubmitQuestionDto,
  ) {
    const user = await this.usersService.findOne(uuid);
    const question = await this.questionService.upsert(submitQuestionDto);
    const card = await this.cardService.create(user, question);
    return card;
  }
}
