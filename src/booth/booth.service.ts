import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoothDto } from './dto/create-booth.dto';
import { UpdateBoothDto } from './dto/update-booth.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from './entities/booth.entity';
import { Event } from 'src/event/entities/event.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { User } from 'src/user/entities/user.entity';
import e from 'express';

@Injectable()
export class BoothService {
  constructor(
    @InjectRepository(Booth) private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    // @InjectRepository(Qrcode) private readonly qrcodeRepository: Repository<Qrcode>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  // async checkQRCodeExist(qrcodeId: number){
  //   const qrcode = await this.qrcodeRepository.findOne({
  //     where: { id: qrcodeId },
  //   });
  //   if (qrcode) return true;
  //   else return false;
  // }

  async create(createBoothDto: CreateBoothDto) {
    
    const event = await this.eventRepository.findOne({
      where: { id: createBoothDto.eventId },
    });
    const user = await this.userRepository.findOne({
      where: { id: createBoothDto.vendorId },
    });
    // const qrcode = await this.qrcodeRepository.findOne({
    //   where: { id: createBoothDto.qrcodeId },
    // });

    const isEventExist = await this.checkEventExist(createBoothDto.eventId);
    const isUserExist = await this.checkUserExist(createBoothDto.vendorId);
    // const isQRCodeExist = await this.checkQRCodeExist(createBoothDto.qrcodeId);

    if (!isEventExist) {
      throw new NotFoundException(`Event ${createBoothDto.eventId} not exist`);
    }

    if (!isUserExist) {
      throw new NotFoundException(`User ${createBoothDto.vendorId} not exist`);
    }

    // if (!isQRCodeExist) {
    //   throw new NotFoundException(`QRCode ${createBoothDto.qrcodeId} not exist`);
    // }
    try {
    const booth = this.boothRepository.create({
      ...createBoothDto,
      eventId: event,
      vendorId: user
    });
    

    return await this.boothRepository.save(booth);
  } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the booth');
    }
  } 

  async findAll(): Promise<Booth[]> {
    return await this.boothRepository.find();
  }

  async findOne(id: number): Promise<Booth> {
    const existingBooth = await this.boothRepository.findOne({ where: { id } });

    if (!existingBooth) {
      throw new NotFoundException(`Booth with ID ${id} not found`);
    }

    return existingBooth;
  }

  async findBoothsByEventId(eventId: number): Promise<Booth[]> {
    const booth = await this.boothRepository.createQueryBuilder('booth')
      .innerJoinAndSelect('booth.eventId', 'event')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .where('booth.eventId = :eventId', { eventId })
      .getMany();
    if (booth.length === 0) {
      throw new NotFoundException(`No booth found for event with ID ${eventId}`);
    }

    return booth;
  }

  async findBoothsByVendorId(vendorId: number): Promise<Booth[]> {
    const booth = await this.boothRepository.createQueryBuilder('booth')
      .innerJoinAndSelect('booth.eventId', 'event')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .where('booth.vendorId = :vendorId', { vendorId })
      .getMany();
    if (booth.length === 0) {
      throw new NotFoundException(`No booth found for vendor with ID ${vendorId}`);
    }

    return booth;
  }

  async update(id: number, updateBoothDto: UpdateBoothDto): Promise<Booth> {
    const existingBooth = await this.boothRepository.findOne({ where: { id } });

    if (!existingBooth) {
      throw new NotFoundException(`Booth with ID ${id} not found`);
    }
    Object.assign(existingBooth, updateBoothDto);
    return await this.boothRepository.save(existingBooth);
  }

  async remove(id: number): Promise<void> {
    const boothToRemove = await this.boothRepository.findOne({ where: { id } });

    if (!boothToRemove) {
      throw new NotFoundException(`Booth with ID ${id} not found`);
    }

    await this.boothRepository.remove(boothToRemove);
    console.log(`Booth with ID ${id} has been deleted successfully.`);
  }
}
