/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async checkIsDateValid(date: string) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date.match(dateRegex)) {
    return false; // Invalid format, return false
  }

  // Extract year, month, and day from the date string
  const [year, month, day] = date.split('-').map(Number);

  // Check if the year is greater than or equal to 1900
  if (year < 1900) {
    return false; // Year is not valid, return false
  }

  // Check if the month is valid (between 1 and 12)
  if (month < 1 || month > 12) {
    return false; // Month is not valid, return false
  }

  // Check if the day is valid
  // Use the last day of the month to validate the day (based on month and year)
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > lastDayOfMonth) {
    return false; // Day is not valid, return false
  }

  // If all checks pass, return true
  return true; // Date is valid
  }

  // create user
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

  // update user
  async update(id: number, updateUserDto: UpdateUserDto,): Promise<User> {
    const isDateValidate = await this.checkIsDateValid(updateUserDto.dob);
    if(updateUserDto.sessionUserId !== id) {
      throw new UnauthorizedException(`You are not authorized to update this user`);
    }

    const isFirstNameContainSpecialCharacter = await this.containsSpecialCharacter(updateUserDto.firstName);
    const isLastNameContainSpecialCharacter = await this.containsSpecialCharacter(updateUserDto.lastName);
    if(isFirstNameContainSpecialCharacter || isLastNameContainSpecialCharacter) {
      throw new NotAcceptableException(`First name and last name must not contain special characters`);
    }
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (!isDateValidate) {
      throw new NotAcceptableException(`Date of birth ${updateUserDto.dob} is invalid`);
    }
    Object.assign(existingUser, updateUserDto);

    return await this.userRepository.save(existingUser);
  }

  // remove user
  async remove(id: number): Promise<void> {
    const userToRemove = await this.userRepository.findOne({ where: { id } });

    if (!userToRemove) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.remove(userToRemove);
  }

  async containsSpecialCharacter(str: string): Promise<boolean> {
    // Create a regular expression to check the string
    const regex = /^[a-zA-Z\s]+$/;
  
    // Use the test() method to check the string
    return !regex.test(str);
  }

}
