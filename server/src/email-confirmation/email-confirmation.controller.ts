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

import { UsersService } from 'src/user/user.service';

@Controller('email-confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findOne(resetPasswordDto.token);

    await this.usersService.updatePassword(
      user.email,
      resetPasswordDto.password,
    );
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
