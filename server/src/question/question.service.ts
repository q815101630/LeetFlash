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

  async findByQuestionId(question_id: string): Promise<Question> {
    const question = await this.questionModel.findOne({ question_id }).exec();

    return question;
  }

  async update(createQuestionDto: CreateQuestionDto): Promise<Question> {
    //delete a field called questionId from createQuestionDto
    const question_id = createQuestionDto.question_id;
    delete createQuestionDto.question_id;
    const existingQuestion = await this.questionModel.findOneAndUpdate(
      { question_id },
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
    if (!!currentQuestion) {
      if (submitQuestionDto.translatedText && !currentQuestion.translatedText) {
        console.log('goes 1');

        return await this.update(submitQuestionDto);
      }
      if (submitQuestionDto.title && !currentQuestion.title) {
        return await this.update(submitQuestionDto);
      }
      console.log('No update!');
      return currentQuestion;
    } else {
      console.log('goes 3');
      return await this.create(submitQuestionDto);
    }
  }

  async getAllQuestions(): Promise<Question[]> {
    return await this.questionModel.find({}).exec();
  }
}
