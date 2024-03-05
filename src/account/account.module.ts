import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: `rXQBMduVMEsrQxRTK9dupYTkXfgsHl7LUN1V1jBBCbtjjvMSV7iMACdOtk+lt+q3
3s5E/t+/i2YwHEeK76HJ3Q==`,
      signOptions: { expiresIn: '10h' },
    }),
  ],
  controllers: [AccountController],
  providers: [AccountService, UserService],
})

export class AccountModule { }

