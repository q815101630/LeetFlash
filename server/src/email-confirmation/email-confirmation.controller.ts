/*
import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import ConfirmEmailDto from './dtos/confirmEmail.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  // TODO: this should be changed to TODO and handled by the front-end, then send the request to the server
  @Get('confirm')
  async confirm(
    @Query('token') token,
    //@Body() confirmationData: ConfirmEmailDto,
  ) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
      //confirmationData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
    return 'Success to verify your email confirmation';
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request: RequestWithUser) {
    await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  }
}
 */
