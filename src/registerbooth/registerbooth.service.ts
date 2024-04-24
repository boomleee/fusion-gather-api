import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRegisterboothDto } from './dto/create-registerbooth.dto';
import { UpdateRegisterboothDto } from './dto/update-registerbooth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from 'src/booth/entities/booth.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Registerbooth } from './entities/registerbooth.entity';
import { Event } from 'src/event/entities/event.entity';


@Injectable()
export class RegisterboothService {
  constructor(
    @InjectRepository(Registerbooth)private readonly registerboothRepository: Repository<Registerbooth>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Booth) private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,

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

  // check if user is registered to booth
  async checkUserIsRegistered(userId: number, boothId: number) {
    const registerbooth = await this.registerboothRepository.createQueryBuilder('registerbooth')
        .where('registerbooth.userId = :userId', { userId })
        .andWhere('registerbooth.boothId = :boothId', { boothId })
        .getOne();

    if (registerbooth) return true;
    else return false;
}

  // register booth
  async create(createRegisterboothDto: CreateRegisterboothDto) {
    if (createRegisterboothDto.userId === null) {
      throw new BadRequestException(`User ID is required!`);
    }

    if (createRegisterboothDto.boothId === null) {
      throw new BadRequestException(`Booth ID is required!`);
    }

    if (createRegisterboothDto.reason === null || createRegisterboothDto.reason === '') {
      throw new BadRequestException(`Reason is required!`);
    }

    const isUserExist = await this.checkUserExist(createRegisterboothDto.userId);
    const isBoothExist = await this.checkBoothExist(createRegisterboothDto.boothId);

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

  async checkEventExist(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event) return true;
    else return false;
  }

  // get all vendor request by event id
  async findAllRequestByEventId(eventId: number, userId: number) {
    const isEventExist = await this.checkEventExist(eventId);
    const event = await this.eventRepository.findOne({
      relations: {
        author: true,
      },
      where: { id: eventId },
    });

    if (!isEventExist) {
      throw new NotFoundException(`Event with ID ${eventId} not exist`);
    }

    if (event.author.id !== userId) {
      throw new UnauthorizedException(`You are not the owner of this event`);
    }

    const registerbooth = await this.registerboothRepository
      .createQueryBuilder('registerbooth')
      .leftJoinAndSelect('registerbooth.user', 'user')
      .leftJoinAndSelect('registerbooth.booth', 'booth')
      .where('booth.eventId = :eventId', { eventId })
      .getMany();

    return registerbooth;
  };

  // check if user is registered to booth
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

  // delete vendor request (decline request)
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
