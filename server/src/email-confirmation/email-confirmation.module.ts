import { forwardRef, Module } from '@nestjs/common';
// import { EmailConfirmationService } from './email-confirmation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { UsersModule } from 'src/user/user.module';

@Module({
  controllers: [],
  imports: [forwardRef(() => UsersModule), ConfigModule, EmailModule],
  providers: [],
  exports: [],
})
export class EmailConfirmationModule {}
