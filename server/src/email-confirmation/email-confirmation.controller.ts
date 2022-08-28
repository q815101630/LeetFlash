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
import ResetPasswordDto from './dtos/resetPassword.dto';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';

import { UsersService } from 'src/user/user.service';
import { request } from 'http';
import { JwtPayload } from 'jwt-decode';
@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // console.log('starting reset email.');
    // console.log(request);
    // const base64Payload = resetPasswordDto.token.split('.')[1];
    // const payloadBuffer = Buffer.from(base64Payload, 'base64');
    // const updatedJwtPayload: JwtPayload = JSON.parse(
    //   payloadBuffer.toString(),
    // ) as JwtPayload;
    // const expires = updatedJwtPayload.exp;
    // if（new Date() > new Date(updatedJwtPayload.exp) 
    // const email =updatedJwtPayload.email||'';
    // console.log(updatedJwtPayload);

    const email = await this.emailConfirmationService.decodeConfirmationToken(
      resetPasswordDto.token,
    );
    console.log(`email${email}`);

    await this.usersService.updatePassword(email, resetPasswordDto.password);
    return 'Success to reset your email password';
  }

  // TODO: this should be changed to TODO and handled by the front-end, then send the request to the server
  // @Get('confirm')
  // async confirm(
  //   @Query('token') token,
  //   //@Body() confirmationData: ConfirmEmailDto,
  // ) {
  //   const email = await this.emailConfirmationService.decodeConfirmationToken(
  //     token,
  //     //confirmationData.token,
  //   );
  //   await this.emailConfirmationService.confirmEmail(email);
  //   return 'Success to verify your email confirmation';
  // }

  // @Post('resend-confirmation-link')
  // @UseGuards(JwtAuthGuard)
  // async resendConfirmationLink(@Req() request: RequestWithUser) {
  //   await this.emailConfirmationService.resendConfirmationLink(request.user.id);
  // }
}
