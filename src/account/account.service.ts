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
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { ResetPasswordCodeDto } from './dto/reset-password-code.dto';
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

    const verificationCode = this.generateVerificationCode();
    await this.mailerService.sendMail({
      to: registerDto.email,
      subject: 'Welcome to my website',
      html: `<b>Your Verification Code is: ${verificationCode}  </b>`,
    });
    const newAccount = this.accountRepository.create({
      user: user,
      username: registerDto.username,
      password: hashPassword,
      verificationCode: verificationCode,
    });
    return await this.accountRepository.save(newAccount);
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find();
  }

  async findOne(id: number): Promise<Account> {
    const existingAcount = await this.accountRepository.findOne({
      where: { id },
    });

    if (!existingAcount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return existingAcount;
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const existingAccount = await this.accountRepository.findOne({
      where: { id },
    });

    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    Object.assign(existingAccount, updateAccountDto);

    return await this.accountRepository.save(existingAccount);
  }

  async remove(id: number): Promise<void> {
    const accountToRemove = await this.accountRepository.findOne({
      where: { id },
    });

    if (!accountToRemove) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await this.accountRepository.remove(accountToRemove);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  private generateVerificationCode(): string {
    let verificationCode = '';

    for (let i = 0; i < 6; i++) {
      const digit = Math.floor(Math.random() * 10);
      verificationCode += digit.toString();
    }
    return verificationCode;
  }
  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const existingAcount = await this.accountRepository.findOne({
      where: { username: verifyAccountDto.username },
    });
    if (
      existingAcount?.verificationCode === verifyAccountDto.verificationCode
    ) {
      existingAcount.isVerified = true;
      return await this.accountRepository.save(existingAcount);
    } else return new NotFoundException(`Can't verify`);
  }

  async requestResetPassword(resetRequestDto: ResetRequestDto) {
    const verificationCode = this.generateVerificationCode();
    const account = await this.findAccountByEmail(resetRequestDto.email);
    if (account) {
      await this.mailerService.sendMail({
        to: resetRequestDto.email,
        subject: 'Reset Password Code',
        html: `<b>Your Reset Password Code is: ${verificationCode}  </b>`,
      });
      account.verificationCode = verificationCode;
      return await this.accountRepository.save(account);
    } else return new NotFoundException(`Email not found`);
  }

  async findAccountByEmail(email: string) {
    const account = await this.accountRepository
      .createQueryBuilder('as')
      .leftJoinAndSelect('as.user', 'user')
      .where('user.email = :email', { email })
      .getOne();
    return account;
  }
  async checkVerificationCode(
    resetPasswordCodeDto: ResetPasswordCodeDto,
  ): Promise<boolean> {
    const account = await this.findAccountByEmail(resetPasswordCodeDto.email);
    if (account.verificationCode === resetPasswordCodeDto.verificationCode) {
      return true;
    } else return false;
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
