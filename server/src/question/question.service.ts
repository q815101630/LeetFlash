import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitQuestionDto } from './dto/submit-question.dto';
import { Question, QuestionDocument } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    return await this.questionModel.create(createQuestionDto);
  }

  async findByQuestionId(questionId: string): Promise<Question> {
    const question = await this.questionModel.findOne({ questionId }).exec();

    return question;
  }

  async update(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const existingQuestion = await this.questionModel.findOneAndUpdate(
      { questionId: createQuestionDto.question_id },
      { $set: createQuestionDto },
      { new: true },
    );
    if (!existingQuestion) {
      throw new NotFoundException(
        `Question #${createQuestionDto.question_id} not found`,
      );
    }
    return existingQuestion;
  }

  async upsert(submitQuestionDto: SubmitQuestionDto): Promise<Question> {
    const currentQuestion = await this.findByQuestionId(
      submitQuestionDto.question_id,
    );
    if (currentQuestion) {
      if (
        (submitQuestionDto.translatedTitle &&
          !currentQuestion?.translatedTitle) ||
        (submitQuestionDto.title && !currentQuestion?.title)
      ) {
        return await this.update(submitQuestionDto);
      }
    } else {
      return await this.create(submitQuestionDto);
    }
  }
}
