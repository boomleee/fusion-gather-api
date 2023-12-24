import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ChangePasswordDto } from 'src/account/dto/change-password.dto';

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

  @Post('/change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    console.log(changePasswordDto);
    return this.accountService.changePassword(changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
