import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from 'src/account/dto/change-password.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userService: UserService,
    private mailerService: MailerService,
  ) {}
  async create(registerDto: RegisterDto) {
    const createUserDto: CreateUserDto = {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      dob: registerDto.dob,
      phoneNumber: registerDto.phoneNumber,
    };
    const user = await this.userService.create(createUserDto);

    const hashPassword = await this.hashPassword(registerDto.password);
    const newAccount = this.accountRepository.create({
      user: user,
      username: registerDto.username,
      password: hashPassword,
    });

    try {
      await this.mailerService.sendMail({
        to: registerDto.email,
        subject: 'Welcome to my website',
        text: 'Hello world',
        html: '<b>Hello world </b>',
      });
    } catch (error) {
      console.log(error);
    }
    return await this.accountRepository.save(newAccount);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async findOne(id: number): Promise<Account> {
    const existingAcount = await this.accountRepository.findOne({where: {id}});

    if(!existingAcount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return existingAcount;
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const existingAccount = await this.accountRepository.findOne({where: {id}});

    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    Object.assign(existingAccount, updateAccountDto)

    return await this.accountRepository.save(existingAccount);
  }

  async remove(id: number): Promise<void> {
    const accountToRemove = await this.accountRepository.findOne({where: {id}});

    if (!accountToRemove) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await this.accountRepository.remove(accountToRemove);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<Account> {
    const {username, oldPassword, newPassword } = changePasswordDto;
    console.log(changePasswordDto);
    const existingAccount = await this.accountRepository.findOne({where: {username : changePasswordDto.username}});

    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${username} not found`);
    }

    const isMatch = await bcrypt.compare(oldPassword, existingAccount.password);

    if (!isMatch) {
      throw new BadRequestException('Old password is not correct');
    }

    const hashPassword = await this.hashPassword(newPassword);
    existingAccount.password = hashPassword;

    return await this.accountRepository.save(existingAccount);
  }
}
