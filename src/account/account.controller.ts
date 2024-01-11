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
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { ResetPasswordCodeDto } from './dto/reset-password-code.dto';
import { Response } from 'express';
import { ChangePasswordDto } from 'src/account/dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshGuard } from 'src/guards/refresh.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('/register')
  @UsePipes(ValidationPipe)
  create(@Body() registerDto: RegisterDto) {
    const account = this.accountService.create(registerDto);
    return account;
  }

  @Get()
  @UsePipes(ValidationPipe)
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Post('/reset-password/new-password')
  @UsePipes(ValidationPipe)
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.accountService.changePassword(changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }

  @Post('/verify')
  @UsePipes(ValidationPipe)
  verify(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.accountService.verifyAccount(verifyAccountDto);
  }

  @Post('/reset-password')
  @UsePipes(ValidationPipe)
  resetPassword(@Body() resetRequestDto: ResetRequestDto) {
    return this.accountService.requestResetPassword(resetRequestDto);
  }

  @Post('/reset-password/check-code')
  @UsePipes(ValidationPipe)
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

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginDto: LoginDto) {
    return this.accountService.login(loginDto);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  refreshToken(
    @Req() req: any
  ) {
    return this.accountService.refreshToken(req.user.id)
  }
}
