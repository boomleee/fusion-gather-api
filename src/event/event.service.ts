/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MoreThanOrEqual } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { request } from 'http';
import { ImageService } from 'src/image/image.service';
import { Booth } from 'src/booth/entities/booth.entity';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Followevent } from 'src/followevent/entities/followevent.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private imageService: ImageService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Registerbooth)
    private readonly registerboothRepository: Repository<Registerbooth>,
    @InjectRepository(Followevent)
    private readonly followeventRepository: Repository<Followevent>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Qrcode)
    private readonly qrCodeRepository: Repository<Qrcode>,
    private readonly qrCodeService: QrCodeService,
    private MailerService: MailerService,
  ) {}

  //check event exist
  async checkEventTitleExist(title: string) {
    const event = await this.eventRepository.findOne({
      where: { title },
    });
    if (event) return true;
    else return false;
  }

  async create(createEventDto: CreateEventDto, user: User) {
    try {
      const isEventTitleExist = await this.checkEventTitleExist(
        createEventDto.title,
      );

      if (isEventTitleExist) {
        throw new NotFoundException(`Title is exist!`);
      }

      const { imageUrl, ...dtoWithoutImage } = createEventDto;
      const event = this.eventRepository.create({
        ...dtoWithoutImage,
      } as DeepPartial<Event>);

      event.author = user;
      const newEvent = await this.eventRepository.save(event);

      // Lưu các hình ảnh liên quan đến sự kiện
      for (const image of imageUrl) {
        await this.imageService.createImage(image, newEvent.id, null);
      }
      const qrCodeId = await this.qrCodeService.generateAndSaveQRCode(
        newEvent.id,
      );
      console.log('qrCodeId', qrCodeId);
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Internal Server Error');
    }
  }

  async findAll({
    userId,
    searchString,
    category,
    pageNumber,
    pageSize,
  }): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.author', 'user');
    // filter by user
    if (userId) {
      query.andWhere('event.author = :userId', { userId: userId });
      return query.getMany();
      return query.getMany();
    }

    // filter by searchString
    if (searchString) {
      query.andWhere(
        '(event.title LIKE :searchString OR event.description LIKE :searchString)',
        { searchString: `%${searchString}%` },
      );
      query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    }

    // filter by category
    if (category) {
      query.andWhere('event.categoryId = :categoryId', {
        categoryId: category,
      });
      query.andWhere('event.isPublished = :isPublished', { isPublished: true });
      query.andWhere('event.categoryId = :categoryId', {
        categoryId: category,
      });
      query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    }

    // pagination
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    query.skip((pageNumber - 1) * pageSize).take(pageSize);

    return query.getMany();
  }

  async findOne(id: number): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({
      relations: {
        author: true,
      },
      where: { id },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return existingEvent;
  }

  async findPendingEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: false });
    return query.getMany();
  }

  async findPublishedEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    return query.getMany();
  }

  async publishEvent(id: number): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({ where: { id } });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const follower = await this.followeventRepository
      .createQueryBuilder('followevent')
      .innerJoinAndSelect('followevent.user', 'user')
      .where('followevent.eventId = :id', { id })
      .getMany();

      const vendorRequest = await this.registerboothRepository.createQueryBuilder('registerbooth')
      .leftJoinAndSelect('registerbooth.user', 'user')
      .leftJoinAndSelect('registerbooth.booth', 'booth')
      .where('booth.eventId = :id', { id })
      .getMany();

      const uniqueUsers = new Map<number, User>();
      vendorRequest.forEach(request => {
        uniqueUsers.set(request.user.id, request.user);
    });

    if (!existingEvent.isPublished) {
      existingEvent.isPublished = true;
    } 

    if (existingEvent.isPublished) {
      if (follower.length > 0) {
      follower.forEach(async (follow) => {
        await this.MailerService.sendMail({
          to: follow.user.email,
          subject: 'Event Published',
          html: `<head>
        <title>Event Published Notification</title>
      </head>
      <body>
        <h1>Event Published Notification</h1>
        <p>Hello, ${follow.user.firstName} ${follow.user.lastName}</p>
        <p>Your following event <strong>${existingEvent.title}</strong> has been published. Click <a href="https://fusiongather.me/event/${existingEvent.id}">here</a> now to register yourself to be an attendee.</p>
        <p>Thank you!</p>
      </body>`,
        });
      });
      }
    }
    if (vendorRequest.length > 0) {
      vendorRequest.forEach(async (request) => {
        await this.MailerService.sendMail({
          to: request.user.email,
          subject: 'Event Published',
          html: `<head>
        <title>Event Published Notification</title>
      </head>
      <body>
        <h1>Event Published Notification</h1>
        <p>Hello, ${request.user.firstName} ${request.user.lastName}</p>
        <p> Event <strong>${existingEvent.title}</strong> that you have request booth has been published. Check your email box to know if your request have been approved or not.</p>
        <p>Thank you!</p>
      </body>`,
        });
        await this.registerboothRepository.remove(request);
      });
    }

    return await this.eventRepository.save(existingEvent);
  }

  async findLatestEvent(): Promise<Event[]> {
    const currentDate = new Date().toISOString();
    const events = await this.eventRepository.find({
      relations: ['author'],
      where: {
        isPublished: true,
        startDateTime: MoreThanOrEqual(currentDate), //only data that is greater than or equal to current date
      },
      order: {
        startDateTime: 'ASC',
      },
      take: 3,
    });
    return events;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({ where: { id } });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    const { imageUrl, ...dtoWithoutImage } = updateEventDto;
    if (imageUrl) {
      await this.removeImagesByEventId(id);
      for (const image of imageUrl) {
        this.imageService.createImage(image, id, null);
      }
    }
    Object.assign(existingEvent, dtoWithoutImage);
    return await this.eventRepository.save(existingEvent);
  }

  async remove(id: number): Promise<void> {
    const eventToRemove = await this.eventRepository.findOne({ where: { id } });

    if (!eventToRemove) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    const boothToRemove = await this.boothRepository
      .createQueryBuilder('booth')
      .where('booth.eventId = :id', { id })
      .getMany();

    if (boothToRemove.length > 0) {
      boothToRemove.forEach(async (booth) => {
        const requestToRemove = await this.registerboothRepository
          .createQueryBuilder('registerbooth')
          .where('registerbooth.boothId = :boothid', { boothid: booth.id })
          .getMany();

        if (requestToRemove.length > 0) {
          requestToRemove.forEach(async (request) => {
            await this.registerboothRepository.remove(request);
          });
        }

        const qrcodeToRemove = await this.qrCodeRepository
          .createQueryBuilder('qrcode')
          .where('qrcode.boothId = :id', { id: booth.id })
          .getOne();

        if (qrcodeToRemove) {
          await this.qrCodeRepository.remove(qrcodeToRemove);
        }

        const imageBoothToRemove = await this.imageRepository
          .createQueryBuilder('image')
          .where('image.boothId = :boothid', {
            boothid: booth.id,
          })
          .getMany();
        if (imageBoothToRemove.length > 0) {
          imageBoothToRemove.forEach(async (image) => {
            await this.imageRepository.remove(image);
          });
        }
      });
    }
    const imageToRemove = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.eventId = :id', { id })
      .getMany();

    const followeventToRemove = await this.followeventRepository
      .createQueryBuilder('followevent')
      .where('followevent.eventId = :id', { id })
      .getMany();

    const ticketToRemove = await this.ticketRepository
      .createQueryBuilder('ticket')
      .where('ticket.eventId = :id', { id })
      .getMany();

    const qrCodeToRemove = await this.qrCodeRepository
      .createQueryBuilder('qrcode')
      .where('qrcode.eventId = :id', { id })
      .getOne();

    if (qrCodeToRemove) {
      await this.qrCodeRepository.remove(qrCodeToRemove);
    }

    if (imageToRemove.length > 0) {
      imageToRemove.forEach(async (image) => {
        await this.imageRepository.remove(image);
      });
    }

    if (ticketToRemove.length > 0) {
      ticketToRemove.forEach(async (ticket) => {
        await this.ticketRepository.remove(ticket);
      });
    }

    if (followeventToRemove.length > 0) {
      followeventToRemove.forEach(async (followevent) => {
        await this.followeventRepository.remove(followevent);
      });
    }

    if (boothToRemove.length > 0) {
      boothToRemove.forEach(async (booth) => {
        await this.boothRepository.remove(booth);
      });
    }

    await this.eventRepository.remove(eventToRemove);
  }

  async removeImagesByEventId(eventId): Promise<void> {
    const imagesToRemove = await this.imageRepository
      .createQueryBuilder('image')
      .where('image.eventId = :eventId', { eventId })
      .getMany();
    if (!imagesToRemove) {
      throw new NotFoundException(`No images found for event ${eventId}`);
    }
    try {
      await this.imageRepository.remove(imagesToRemove);
    } catch (error) {
      // Handle error if needed
      console.error('Error removing images:', error);
      throw new Error('Failed to remove images');
    }
  }
}
