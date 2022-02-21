// import { BadRequestException, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import VerificationTokenPayload from './interfaces/verificationTokenPayload.interface';
// import EmailService from 'src/email/email.service';
// import { UsersService } from 'src/user/user.service';

// /**
//  * A service that sends email verification tokens to users.
//  */
// @Injectable()
// export class EmailConfirmationService {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly emailService: EmailService,
//     private readonly usersService: UsersService,
//   ) {}

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

//   public async decodeConfirmationToken(token: string) {
//     try {
//       const payload = await this.jwtService.verify(token, {
//         secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
//       });

//       if (typeof payload === 'object' && 'email' in payload) {
//         return payload.email;
//       }
//       throw new BadRequestException();
//     } catch (error) {
//       if (error?.name === 'TokenExpiredError') {
//         throw new BadRequestException('Email confirmation token expired');
//       }
//       throw new BadRequestException('Bad confirmation token');
//     }
//   }

//   public async resendConfirmationLink(userId: number) {
//     const user = await this.usersService.findById(userId);
//     if (user.emailVerified) {
//       throw new BadRequestException('Email already confirmed');
//     }
//     await this.sendVerificationLink(user.email);
//   }
// }
