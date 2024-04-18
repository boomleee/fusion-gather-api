import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Account } from './entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyAccountDto } from './dto/verify-account.dto';
import { ResetRequestDto } from './dto/reset-request.dto';
import { ResetPasswordCodeDto } from './dto/reset-password-code.dto';
import { ChangePasswordDto } from 'src/account/dto/change-password.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

const EXPIRE_TIME = 10 * 60 * 60 * 1000;

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userService: UserService,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  //check username exist
  async checkUsernameExist(username: string) {
    const account = await this.accountRepository.findOne({
      where: { username },
    });
    if (account) return true;
    else return false;
  }

  async create(registerDto: RegisterDto) {
    const createUserDto: CreateUserDto = {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      dob: registerDto.dob,
      phoneNumber: registerDto.phoneNumber,
    };
    const isUsernameExist = await this.checkUsernameExist(registerDto.username);

    if (isUsernameExist) {
      throw new NotFoundException(`Username ${registerDto.username} exist`);
    }

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

  async findOneByUsername(username: string): Promise<Account> {
    const existingAcount = await this.accountRepository.findOne({
      where: { username },
    });

    if (!existingAcount) {
      throw new NotFoundException(
        `Account with username ${username} not found`,
      );
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

  async disableAccount(id: number): Promise<Account> {
    if (id === null) {
      throw new BadRequestException(`Account ID is required`);
    }
    const existingAccount = await this.accountRepository.findOne({
      where: { id: id },
    });

    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    if (existingAccount.isActivated === false) {
      existingAccount.isActivated = true;
      console.log(`Account with ID ${id} has been enabled`);
      const disableAcc = await this.accountRepository.save(existingAccount);
      return disableAcc;
    }

    if (existingAccount.isActivated === true) {
      existingAccount.isActivated = false;
      console.log(`Account with ID ${id} has been disabled`);
      const disableAcc = await this.accountRepository.save(existingAccount);
      return disableAcc;
    }
  }

  async remove(id: number): Promise<void> {
    const accountToRemove = await this.accountRepository.findOne({
      where: { id },
    });

    if (!accountToRemove) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    await this.accountRepository.remove(accountToRemove);

    await this.userService.remove(id);
    console.log(`Account with ID ${id} has been removed`);
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
    const { email, newPassword } = changePasswordDto;
    const existingAccount = await this.findAccountByEmail(email);
    if (!existingAccount) {
      throw new NotFoundException(`Account with ID ${email} not found`);
    }
    const hashPassword = await this.hashPassword(newPassword);
    existingAccount.password = hashPassword;

    return await this.accountRepository.save(existingAccount);
  }

  private async generateToken(payload: { id: number }) {
    const { id } = payload;

    const user = await this.userService.findOne(id);
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });
    return {
      user,
      tokens: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expriesIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async login(loginDto: LoginDto) {
    const account = await this.accountRepository.findOne({
      where: { username: loginDto.username },
    });
    if (!account) {
      throw new NotFoundException('Username is not exist');
    }
    const checkPass = bcrypt.compareSync(loginDto.password, account.password);
    if (!checkPass) {
      throw new NotFoundException('Password is not correct');
    }

    if (!account.isActivated) {
      throw new NotFoundException('Account is disabled');
    }
    const payload = { id: account.id };
    return this.generateToken(payload);
  }
  async adminLogin(loginDto: LoginDto) {
    const account = await this.accountRepository.findOne({
      where: { username: loginDto.username },
      relations: ['user'],
    });
    if (!account) {
      throw new NotFoundException('Username is not exist');
    }
    if (!account.user.isAdmin) {
      throw new NotFoundException('Your user is not admin');
    }
    const checkPass = bcrypt.compareSync(loginDto.password, account.password);
    if (!checkPass) {
      throw new NotFoundException('Password is not correct');
    }

    if (!account.isActivated) {
      throw new NotFoundException('Account is disabled');
    }
    const payload = { id: account.id };
    return this.generateToken(payload);
  }

  async refreshToken(id: number) {
    return this.generateToken({ id });
  }
}
