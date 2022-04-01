import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';
import { UserDto } from 'src/auth/dtos/user.dto';
import { CardGateway } from 'src/card/card.gateway';
import { CardService } from 'src/card/card.service';
import { LocalAuthGuard, SuperUserAuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SubmitQuestionDto } from 'src/question/dto/submit-question.dto';
import { QuestionService } from 'src/question/question.service';
import { UsersService } from './user.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('api/user')
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private questionService: QuestionService,
    private cardService: CardService,
    private cardGateway: CardGateway,
  ) {}

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

  @Post('/add-question/')
  async submitQuestion(
    @Headers('UUID') uuid: string,
    @Body() submitQuestionDto: SubmitQuestionDto,
  ) {
    const user = await this.usersService.findOne(uuid).catch(() => {
      throw new NotFoundException('Cannot find the user');
    });
    const question = await this.questionService.upsert(
      submitQuestionDto.question,
    );

    return this.cardGateway.handleSubmit(user, submitQuestionDto, question);
  }
}
