import { Module } from '@nestjs/common';
import EmailService from './email.service';
import { ConfigModule } from '@nestjs/config';
import EmailSchedulingService from './emailScheduling.service';
import EmailSchedulingController from './emailScheduling.controller';

@Module({
  imports: [ConfigModule],
  controllers: [EmailSchedulingController],
  providers: [EmailService, EmailSchedulingService],
  exports: [EmailService],
})
export class EmailModule {}
