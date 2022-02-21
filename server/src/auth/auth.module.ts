import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailConfirmationModule } from 'src/email-confirmation/email-confirmation.module';
import { UsersModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/entities/user.entity';

@Module({
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => UsersModule),
    PassportModule,
    ConfigModule,

    EmailConfirmationModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
