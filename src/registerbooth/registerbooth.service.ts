import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegisterboothDto } from './dto/create-registerbooth.dto';
import { UpdateRegisterboothDto } from './dto/update-registerbooth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from 'src/booth/entities/booth.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Registerbooth } from './entities/registerbooth.entity';


@Injectable()
export class RegisterboothService {
  constructor(
    @InjectRepository(Registerbooth)private readonly registerboothRepository: Repository<Registerbooth>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Booth) private readonly boothRepository: Repository<Booth>,

  ) {}

  async checkUserExist(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user) return true;
    else return false;
  }

  async checkBoothExist(boothId: number) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });
    if (booth) return true;
    else return false;
  }

  async checkUserIsRegistered(userId: number, boothId: number) {
    const registerbooth = await this.registerboothRepository.createQueryBuilder('registerbooth')
        .where('registerbooth.userId = :userId', { userId })
        .andWhere('registerbooth.boothId = :boothId', { boothId })
        .getOne();

    if (registerbooth) return true;
    else return false;
}


  async create(createRegisterboothDto: CreateRegisterboothDto) {
    const isUserExist = this.checkUserExist(createRegisterboothDto.userId);
    const isBoothExist = this.checkBoothExist(createRegisterboothDto.boothId);

    if (!isUserExist) {
      throw new NotFoundException(`User does not exist!`);
    }

    if (!isBoothExist) {
      throw new NotFoundException(`Booth does not exist!`);
    }

    const isUserRegistered = await this.checkUserIsRegistered(
      createRegisterboothDto.userId,
      createRegisterboothDto.boothId,
    );

    if (isUserRegistered) {
      throw new BadRequestException(
        `User has already registered this booth!`,
      );
    }

    const registerbooth = this.registerboothRepository.create({
      userId: createRegisterboothDto.userId,
      boothId: createRegisterboothDto.boothId,
      reason: createRegisterboothDto.reason,
    });

    return await this.registerboothRepository.save(registerbooth);
  }

  async findAllRequestByEventId(eventId: number) {
    const registerbooth = await this.registerboothRepository
      .createQueryBuilder('registerbooth')
      .leftJoinAndSelect('registerbooth.user', 'user')
      .leftJoinAndSelect('registerbooth.booth', 'booth')
      .where('booth.eventId = :eventId', { eventId })
      .getMany();
    if (registerbooth.length === 0) {
      throw new BadRequestException(
        `No booth registration request found for event with ID ${eventId}`,
      );
    }

    return registerbooth;
  };

  async checkIsRegistered(userId: number, boothId: number) {
    const isUserExist = await this.checkUserExist(userId);
    const isBoothExist = await this.checkBoothExist(boothId);

    if (!isUserExist) {
      throw new NotFoundException(`User ${userId} not exist`);
    }

    if (!isBoothExist) {
      throw new NotFoundException(`Booth ${boothId} not exist`);
    }

    const registerbooth = await this.registerboothRepository.findOne({
      where: { userId: userId, boothId: boothId },
    });
    if (registerbooth) return true;
    else return false;
  }

  findAll() {
    return `This action returns all registerbooth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registerbooth`;
  }

  async remove(userId: number, boothId: number) {
    const isUserExist = await this.checkUserExist(userId);
    const isBoothExist = await this.checkBoothExist(boothId);

    if (!isUserExist) {
      throw new NotFoundException(`User ${userId} not exist`);
    }

    if (!isBoothExist) {
      throw new NotFoundException(`Booth ${boothId} not exist`);
    }

    const registerbooth = await this.registerboothRepository.findOne({
      where: { userId: userId, boothId: boothId },
    });

    if (!registerbooth) {
      throw new BadRequestException(
        `User ${userId} does not register booth ${boothId}`,
      );
    }

    return await this.registerboothRepository.remove(registerbooth);
  }
}
