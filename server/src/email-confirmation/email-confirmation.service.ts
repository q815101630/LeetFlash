import { ConfigService } from '@nestjs/config';
import EmailService from 'src/email/email.service';
import { UsersService } from 'src/user/user.service';

import { NotFoundException, Injectable } from '@nestjs/common';

/**
 * A service that sends email verification tokens to users.
 */
@Injectable()
export class EmailConfirmationService {
  // private readonly emailResetPasswordUrl: string;
  private readonly emailExpiration: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public async sendEmailResetLink(email: string) {
    const user = await this.usersService.findByEmail(email);
    const token = user._id;
    const resetLink = `${this.configService.get(
      'RESET_PASSWORD_URL',
    )}?token=${token}`;
    const templateParams = {
      resetLink,
      expires_minutes: (this.emailExpiration / 60).toFixed(),
    } as const;
    const text = `Welcome to LeetFlash. To reset password, click here: ${resetLink}.`;
    let mailOptions = {
      from: '"LeetFlash" <' + this.configService.get('EMAIL_USER') + '>',
      to: email,
      subject: 'Reset your LeetFlash password',
      text: 'Forgot Password',
      html: text,
      context: templateParams,
    };
    const sent = await this.emailService.sendMail(mailOptions);
    if (sent) {
      // console.log('Reset Password Email Sent');
      return true;
    } else {
      throw new NotFoundException(`Unable to send email. Try again.`);
    }
  }

  //   /**
  //    *
  //    * @param email The email address of the user to send the token to.
  //    * @returns A promise dedicating if the task is completed or not.
  //    */
  //   public sendVerificationLink(email: string) {
  //     const payload: VerificationTokenPayload = { email };
  //     const token = this.jwtService.sign(payload, {
  //       secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
  //       expiresIn: `${this.configService.get('EMAIL_TOKEN_EXPIRATION_TIME')}s`,
  //     });

  //     const url = `${this.configService.get(
  //       'EMAIL_CONFIRMATION_URL',
  //     )}?token=${token}`;

  //     const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

  //     return this.emailService.sendMail({
  //       to: email,
  //       subject: 'Email confirmation',
  //       text,
  //     });
  //   }

  //   public async confirmEmail(email: string) {
  //     const user = await this.usersService.findByEmail(email);
  //     if (user.emailVerified) {
  //       throw new BadRequestException('Email already confirmed');
  //     }
  //     await this.usersService.updateUserVerifyStatus(email, true);
  //   }

  //   public async resendConfirmationLink(userId: number) {
  //     const user = await this.usersService.findById(userId);
  //     if (user.emailVerified) {
  //       throw new BadRequestException('Email already confirmed');
  //     }
  //     await this.sendVerificationLink(user.email);
  //   }
}
