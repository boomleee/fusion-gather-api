import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFolloweventDto } from './dto/create-followevent.dto';
import { UpdateFolloweventDto } from './dto/update-followevent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Repository } from 'typeorm';
import { Followevent } from './entities/followevent.entity';

@Injectable()
export class FolloweventService {
  constructor(
    @InjectRepository(Followevent) private readonly followeventRepository: Repository<Followevent>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
  ) {}

  async checkEventExist(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event) return true;
    else return false;
  }

  async checkUserExist(vendorId: number){
    const user = await this.userRepository.findOne({
      where: { id: vendorId },
    });
    if (user) return true;
    else return false;
  }

    async create(createFolloweventDto: CreateFolloweventDto) {
    const user = await this.userRepository.findOne({
      where: { id: createFolloweventDto.userId },
    });

    const event = await this.eventRepository.findOne({
      where: { id: createFolloweventDto.eventId },
    });

    const isEventExist = await this.checkEventExist(createFolloweventDto.eventId);
    const isUserExist = await this.checkUserExist(createFolloweventDto.userId);

    if (!isEventExist) {
      throw new NotFoundException(`Event does not exist!`);
    }

    if (!isUserExist) {
      throw new NotFoundException(`User does not exist!`);
    }

    try 
    {
      const followevent = this.followeventRepository.create({
        ...createFolloweventDto,
        eventId: event,
        userId: user,
      });
      return await this.followeventRepository.save(followevent);
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Follow event failed!`);
    }

  }

  async findAll():Promise<Followevent[]> {
    return await this.followeventRepository.find();
  }

  async findFEventByUser(userId: number):Promise<Followevent[]> {
    const eventfollow = await this.followeventRepository.createQueryBuilder('followevent')
    .innerJoinAndSelect('followevent.eventId', 'event')
    .innerJoinAndSelect('followevent.userId', 'user')
    .where('followevent.userId = :userId', { userId })
    .getMany();

    if (eventfollow.length === 0) {
      throw new NotFoundException(`No event found for user ${userId}`);
    }

    return eventfollow;
  }

  async countUserFollowEvent(eventId: number): Promise<number> {
    const count = await this.followeventRepository.createQueryBuilder('followevent')
    .where('followevent.eventId = :eventId', { eventId })
    .getCount();

    return count;
  }

  async checkisUserFollowEvent(userId: number, eventId: number): Promise<boolean> {
    const followevent = await this.followeventRepository.createQueryBuilder('followevent')
    .where('followevent.userId = :userId', { userId })
    .andWhere('followevent.eventId = :eventId', { eventId })
    .getOne();

    if (followevent) {
      return true;
    } else {
      return false;
    }
  }

  async remove(userId: number, eventId: number) {
    const isEventExist = this.checkEventExist(eventId);
    const isUserExist = this.checkUserExist(userId);

    if (!isEventExist) {
      throw new NotFoundException(`Event does not exist!`);
    }

    if (!isUserExist) {
      throw new NotFoundException(`User does not exist!`);
    }

    const followevent = await this.followeventRepository.createQueryBuilder('followevent')
    .where('followevent.userId = :userId', { userId })
    .andWhere('followevent.eventId = :eventId', { eventId })
    .getOne();

    if (!followevent) {
      throw new NotFoundException(`Follow event does not exist!`);
    }

    return await this.followeventRepository.remove(followevent);
  }
}
