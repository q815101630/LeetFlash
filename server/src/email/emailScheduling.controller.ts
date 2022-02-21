import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import EmailScheduleDto from './dtos/emailSchedule.dto';
import EmailSchedulingService from './emailScheduling.service';

@Controller('email-scheduling')
export default class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(LocalAuthGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
