import { Injectable } from '@nestjs/common';
import EmailService from '../email/email.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import EmailScheduleDto from './dtos/emailSchedule.dto';

/**
 * A service providing scheduleEmail function to schedule email by emailScheduleDto
 */
@Injectable()
export default class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * schedule email by emailScheduleDto
   * @param emailSchedule A dto containing email information
   */
  scheduleEmail(emailSchedule: EmailScheduleDto) {
    // using Date is to schedule for one time task
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content,
      });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );
    job.start();
  }

  /**
   * A method to cancel all scheduled email
   */
  cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    });
  }
}
