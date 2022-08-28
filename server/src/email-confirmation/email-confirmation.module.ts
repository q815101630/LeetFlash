import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { UsersModule } from 'src/user/user.module';
import { EmailConfirmationService } from 'src/email-confirmation/email-confirmation.service';
import { EmailConfirmationController } from 'src/email-confirmation/email-confirmation.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [EmailConfirmationController],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_SECRET,
      },
    }),
  ],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
