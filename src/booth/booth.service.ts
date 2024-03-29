import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoothDto } from './dto/create-booth.dto';
import { UpdateBoothDto } from './dto/update-booth.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from './entities/booth.entity';
import { Event } from 'src/event/entities/event.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { User } from 'src/user/entities/user.entity';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';
import e from 'express';

@Injectable()
export class BoothService {
  constructor(
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Qrcode)
    private readonly qrcodeRepository: Repository<Qrcode>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Registerbooth)
    private readonly registerboothRepository: Repository<Registerbooth>,
    @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    private imageService: ImageService,
  ) {}

  async checkEventExist(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event) return true;
    else return false;
  }

  async checkUserExist(vendorId: number) {
    const user = await this.userRepository.findOne({
      where: { id: vendorId },
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

  async checkQRCodeExist(qrcodeId: number) {
    const qrcode = await this.qrcodeRepository.findOne({
      where: { id: qrcodeId },
    });
    if (qrcode) return true;
    else return false;
  }

  async create(createBoothDto: CreateBoothDto) {
    const event = await this.eventRepository.findOne({
      where: { id: createBoothDto.eventId },
    });
    const user = await this.userRepository.findOne({
      where: { id: createBoothDto.vendorId },
    });

    const isEventExist = await this.checkEventExist(createBoothDto.eventId);
    const isUserExist = await this.checkUserExist(createBoothDto.vendorId);

    if (!isEventExist) {
      throw new NotFoundException(`Event ${createBoothDto.eventId} not exist`);
    }

    if (!isUserExist) {
      throw new NotFoundException(`User ${createBoothDto.vendorId} not exist`);
    }

    const { imageUrl, ...dtoWithoutImage } = createBoothDto;

      const booth = this.boothRepository.create({
        ...dtoWithoutImage,
        eventId: event,
        vendorId: user,
      });

      const newBooth = await this.boothRepository.save(booth);
      for (const image of imageUrl) {
        this.imageService.createBoothImages(image, newBooth.id);
      }

      return newBooth;

  }

  async findAll(): Promise<Booth[]> {
    return await this.boothRepository.find();
  }

  async findOne(id: number): Promise<Booth> {
    const existingBooth = await this.boothRepository
      .createQueryBuilder('booth')
      .innerJoinAndSelect('booth.eventId', 'event')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .where('booth.id = :id', { id })
      .getOne();

    if (!existingBooth) {
      throw new NotFoundException(`Booth with ID ${id} not found`);
    }
    return existingBooth;
  }

  async findBoothsByEventId(eventId: number): Promise<Booth[]> {
    const booth = await this.boothRepository
      .createQueryBuilder('booth')
      .innerJoinAndSelect('booth.eventId', 'event')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .where('booth.eventId = :eventId', { eventId })
      .getMany();
    if (booth.length === 0) {
      throw new NotFoundException(
        `No booth found for event with ID ${eventId}`,
      );
    }

    return booth;
  }

  async findBoothsByVendorId(vendorId: number): Promise<Booth[]> {
    const booth = await this.boothRepository
      .createQueryBuilder('booth')
      .innerJoinAndSelect('booth.eventId', 'event')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .where('booth.vendorId = :vendorId', { vendorId })
      .getMany();
    if (booth.length === 0) {
      throw new NotFoundException(
        `No booth found for vendor with ID ${vendorId}`,
      );
    }

    return booth;
  }

  async checkBoothAuthor(boothId: number, userId: number) {
    const booth = await this.boothRepository
      .createQueryBuilder('booth')
      .andWhere('booth.id = :boothId', { boothId })
      .andWhere('booth.vendorId = :userId', { userId })
      .getOne();
    if (booth) {
      return true;
    }
    return false;
  }

  async removeImagesByBoothId(boothId: number) {
    const images = await this.imageRepository.createQueryBuilder('image')
      .where('image.boothId = :boothId', { boothId })
      .getMany();

    if (!images) {
      throw new NotFoundException(`No images found for booth ${boothId}`);
    }

    if (images.length > 0) {
      images.forEach(async (image) => {
        await this.imageRepository.remove(image);
      });
    }
  }

  async update(
    userId: number,
    boothId: number,
    updateBoothDto: UpdateBoothDto,
  ): Promise<Booth> {
    const isUserExist = await this.checkUserExist(userId);
    const isBoothExist = await this.checkBoothExist(boothId);

    if (!isUserExist) {
      throw new NotFoundException(`User ${userId} not exist`);
    }

    if (!isBoothExist) {
      throw new NotFoundException(`Booth ${boothId} not exist`);
    }

    const isBoothAuthor = await this.checkBoothAuthor(boothId, userId);
    if (!isBoothAuthor) {
      throw new ForbiddenException(
        'You dont have permission to modify this booth',
      );
    }
    const existingBooth = await this.boothRepository.findOne({
      where: { id: boothId },
    });

    if (!existingBooth) {
      throw new NotFoundException(`Booth with ID ${boothId} not found`);
    }

    const { imageUrl, ...dtoWithoutImage } = updateBoothDto;
    if (imageUrl) {
      await this.removeImagesByBoothId(boothId);
      for (const image of imageUrl) {
        this.imageService.createBoothImages(image, boothId);
      }
    }
    Object.assign(existingBooth, dtoWithoutImage);
    return await this.boothRepository.save(existingBooth);
  }

  async assignBoothToUser(userId: number, boothId: number) {
    const isUserExist = await this.checkUserExist(userId);
    const isBoothExist = await this.checkBoothExist(boothId);

    if (!isUserExist) {
      throw new NotFoundException(`User ${userId} not exist`);
    }

    if (!isBoothExist) {
      throw new NotFoundException(`Booth ${boothId} not exist`);
    }

    const isBoothAuthor = await this.checkBoothAuthor(boothId, userId);
    if (isBoothAuthor) {
      throw new ConflictException(
        'You are already the owner of this booth',
      );
    }

    const existingBooth = await this.boothRepository.createQueryBuilder('booth')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .where('booth.id = :boothId', { boothId })
      .getOne();

    if (!existingBooth) {
      throw new NotFoundException(`Booth with ID ${boothId} not found`);
    }

    existingBooth.vendorId.id = userId;
    return await this.boothRepository.save(existingBooth);
  }

  async remove(userId: number, boothId: number): Promise<void> {
    const isUserExist = await this.checkUserExist(userId);
    const isBoothExist = await this.checkBoothExist(boothId);

    if (!isUserExist) {
      throw new NotFoundException(`User ${userId} not exist`);
    }

    if (!isBoothExist) {
      throw new NotFoundException(`Booth ${boothId} not exist`);
    }
    const isBoothAuthor = await this.checkBoothAuthor(boothId, userId);
    if (!isBoothAuthor) {
      throw new ForbiddenException(
        'You dont have permission to delete this booth',
      );
    }
    const boothToRemove = await this.boothRepository
      .createQueryBuilder('booth')
      .where('booth.id = :boothId', { boothId })
      .getOne();

    const requestedBooth = await this.registerboothRepository
      .createQueryBuilder('registerbooth')
      .where('registerbooth.boothId = :boothId', { boothId })
      .getMany();

    const imageBoothToRemove = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.boothId = :boothId', { boothId })
      .getMany();

    if (imageBoothToRemove.length > 0) {
      imageBoothToRemove.forEach(async (image) => {
        await this.imageRepository.remove(image);
      });
    }  

    if (requestedBooth.length > 0) {
      requestedBooth.forEach(async (request) => {
        await this.registerboothRepository.remove(request);
      });
    }

      if (!boothToRemove) {
        throw new NotFoundException(`Booth with ID ${boothId} not found`);
      }

      await this.boothRepository.remove(boothToRemove);
      console.log(`Booth with ID ${boothId} has been deleted successfully.`);
  }
}
