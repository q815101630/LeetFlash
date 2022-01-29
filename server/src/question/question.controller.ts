import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/')
  // @UseGuards(LocalAuthGuard)
  async getQuestions() {
    const questions = await this.questionService.getAllQuestions();
    return questions;
  }
}
