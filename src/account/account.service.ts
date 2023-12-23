import { Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Account } from './entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly userService: UserService,
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

    return await this.accountRepository.save(newAccount);
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash
  }
}
