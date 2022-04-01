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
    const { questionId } = createQuestionDto;
    delete createQuestionDto.questionId; //why do I delete? bug?
    const existingQuestion = await this.questionModel.findOneAndUpdate(
      { questionId },
      { $set: createQuestionDto },
      { new: true },
    );
    if (!existingQuestion) {
      throw new NotFoundException(`Question #${questionId} not found`);
    }
    return existingQuestion;
  }

  async upsert(question: CreateQuestionDto): Promise<Question> {
    const currentQuestion = await this.findByQuestionId(question.questionId);
    if (!!currentQuestion) {
      if (!currentQuestion.translatedTitle && question.translatedTitle) {
        this.update(question);
      }
      return currentQuestion;
    } else {
      return await this.create(question);
    }
  }

  async getAllQuestions(): Promise<Question[]> {
    return await this.questionModel.find({}).exec();
  }
}
