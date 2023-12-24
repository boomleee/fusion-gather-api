import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { ResetPasswordCodeDto } from './dto/reset-password-code.dto';
import { Response } from 'express';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/register')
  create(@Body() registerDto: RegisterDto) {
    const account = this.accountService.create(registerDto);
    return account;
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Post('/verify')
  verify(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.accountService.verifyAccount(verifyAccountDto);
  }

  @Post('/reset-password')
  resetPassword(@Body() resetRequestDto: ResetRequestDto) {
    return this.accountService.requestResetPassword(resetRequestDto);
  }

  @Post('/reset-password/check-code')
  checkVerificationCode(
    @Body() resetPasswordCodeDto: ResetPasswordCodeDto,
    @Res() res: Response,
  ) {
    this.accountService
      .checkVerificationCode(resetPasswordCodeDto)
      .then((isVerified) => {
        if (isVerified) {
          return res.status(HttpStatus.OK).send();
        } else {
          return res.status(HttpStatus.BAD_REQUEST).send();
        }
      });
  }
}
