import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  //check email exist
  async checkEmailExist(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) return true;
    else return false;
  }

  //check phone number exist
  async checkPhoneNumberExist(phoneNumber: string) {
    const user = await this.userRepository.findOne({
      where: { phoneNumber },
    });
    if (user) return true;
    else return false;
  }

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.checkEmailExist(createUserDto.email);
    const isPhoneNumberExist = await this.checkPhoneNumberExist(
      createUserDto.phoneNumber,
    );

    if (isEmailExist) {
      throw new NotFoundException(`Email ${createUserDto.email} exist`);
    }

    if (isPhoneNumberExist) {
      throw new NotFoundException(
        `Phone number ${createUserDto.phoneNumber} exist`,
      );
    }

    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return existingUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(existingUser, updateUserDto);

    return await this.userRepository.save(existingUser);
  }

  async remove(id: number): Promise<void> {
    const userToRemove = await this.userRepository.findOne({ where: { id } });

    if (!userToRemove) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(userToRemove);
  }
}
