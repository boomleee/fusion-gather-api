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
import e from 'express';
import { ImageService } from 'src/image/image.service';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class BoothService {
  constructor(
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Qrcode)
    private readonly qrcodeRepository: Repository<Qrcode>,
    private readonly QrCodeService: QrCodeService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Registerbooth)
    private readonly registerboothRepository: Repository<Registerbooth>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private imageService: ImageService,
    private mailerService: MailerService,
  ) {}

  async checkEventExist(eventId: number) {
    if (eventId === null) return false;
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event) return true;
    else return false;
  }

  async checkUserExist(vendorId: number) {
    if (vendorId === null) return false;
    const user = await this.userRepository.findOne({
      where: { id: vendorId },
    });
    if (user) return true;
    else return false;
  }

  async checkBoothExist(boothId: number) {
    if (boothId === null) return false;
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

    if (createBoothDto.name === '' || createBoothDto.name === null) {
      throw new BadRequestException('Booth name cannot be empty');
    }

    if (createBoothDto.description === '' || createBoothDto.description === null) {
      throw new BadRequestException('Booth description cannot be empty');
    }

    if (createBoothDto.latitude === null || createBoothDto.longitude === null) {
      throw new BadRequestException('Booth location is invalid');
    }

    if (createBoothDto.latitude < -90 || createBoothDto.latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (createBoothDto.longitude < -180 || createBoothDto.longitude > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
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
    const qrCode = await this.QrCodeService.generateAndSaveQRCodeForBooth(
      newBooth.id,
    );
    console.log(qrCode);
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
    const images = await this.imageRepository
      .createQueryBuilder('image')
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

    if (updateBoothDto.name === '' || updateBoothDto.name === null) {
      throw new BadRequestException('Booth name cannot be empty');
    }

    if (updateBoothDto.description === '' || updateBoothDto.description === null) {
      throw new BadRequestException('Booth description cannot be empty');
    }

    if (updateBoothDto.latitude === null || updateBoothDto.longitude === null) {
      throw new BadRequestException('Booth location is invalid');
    }

    if (updateBoothDto.latitude < -90 || updateBoothDto.latitude > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (updateBoothDto.longitude < -180 || updateBoothDto.longitude > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
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
      throw new ConflictException('You are already the owner of this booth');
    }

    const existingBooth = await this.boothRepository
      .createQueryBuilder('booth')
      .innerJoinAndSelect('booth.vendorId', 'user')
      .innerJoinAndSelect('booth.eventId', 'event')
      .where('booth.id = :boothId', { boothId })
      .getOne();

    const vendor = await this.registerboothRepository
      .createQueryBuilder('registerbooth')
      .innerJoinAndSelect('registerbooth.user', 'user')
      .andWhere('registerbooth.boothId = :boothId', { boothId })
      .andWhere('registerbooth.userId = :userId', { userId })
      .getOne();

    if (!existingBooth) {
      throw new NotFoundException(`Booth with ID ${boothId} not found`);
    }

    existingBooth.vendorId.id = userId;
    await this.mailerService.sendMail({
      to: vendor.user.email,
      subject: 'Booth Ownership Transfer',
      html: `
      <h1>Booth Assignment Notification</h1>
      <p>Hello, ${vendor.user.firstName} ${vendor.user.lastName}</p>
      <p>You have been assigned as the owner of booth <strong>${existingBooth.name}</strong> in event <strong>${existingBooth.eventId.title}</strong>.</p>
      <p>Please login to your account to view the booth details and update it as soon as posible.</p>
      <p>Thank you!</p>`,
    });
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

    const boothToRemove = await this.boothRepository
      .createQueryBuilder('booth')
      .where('booth.id = :boothId', { boothId })
      .getOne();

    if (!boothToRemove) {
      throw new NotFoundException(`Booth with ID ${boothId} not found`);
    }

    const requestedBooth = await this.registerboothRepository
      .createQueryBuilder('registerbooth')
      .where('registerbooth.boothId = :boothId', { boothId })
      .getMany();

    if (requestedBooth.length > 0) {
      await Promise.all(requestedBooth.map(async (request) => {
        await this.registerboothRepository.remove(request);
    }
    ));
    }

    const imageBoothToRemove = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.boothId = :boothId', { boothId })
      .getMany();

    const qrcodeToRemove = await this.qrcodeRepository
      .createQueryBuilder('qrcode')
      .where('qrcode.boothId = :boothId', { boothId })
      .getOne();

    if (imageBoothToRemove.length > 0) {
      imageBoothToRemove.forEach(async (image) => {
        await this.imageRepository.remove(image);
      });
    }

    if (qrcodeToRemove) {
      await this.qrcodeRepository.remove(qrcodeToRemove);
    }
    await this.boothRepository.remove(boothToRemove);
    console.log(`Booth with ID ${boothId} has been deleted successfully.`);
  }
}
