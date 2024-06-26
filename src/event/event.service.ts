/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DeepPartial, Equal, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MoreThanOrEqual } from 'typeorm';
import { Image } from 'src/image/entities/image.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { ImageService } from 'src/image/image.service';
import { Booth } from 'src/booth/entities/booth.entity';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Followevent } from 'src/followevent/entities/followevent.entity';
import { Category } from 'src/category/entities/category.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EventStatisticDTO } from './dto/event-statistic.dto';
import { TotalStatisticDTO } from './dto/total-statistic.dto';
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
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private MailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //check event exist
  async checkEventTitleExist(title: string) {
    const event = await this.eventRepository.findOne({
      where: { title },
    });
    if (event) return true;
    else return false;
  }

  // create event
  async create(createEventDto: CreateEventDto, user: User) {
    try {
      const isEventTitleExist = await this.checkEventTitleExist(
        createEventDto.title,
      );
      
      const category = await this.categoryRepository.findOne({
        where: { id: createEventDto.category },
      });

      if (!category) {
        throw new NotFoundException(`Category is not exist!`);
      }
      if (createEventDto.title === ""|| createEventDto.title === null) {
        throw new NotAcceptableException(`Title is blank or null`);
      }

      if (isEventTitleExist) {
        throw new NotAcceptableException(`Title is exist!`);
      }

      if (createEventDto.category === null) {
        throw new NotAcceptableException(`Category is blank`);
      }

      if (createEventDto.description === "") {
        throw new NotAcceptableException(`Description is blank`);
      }

      if (createEventDto.startDateTime === "") {
        throw new NotAcceptableException(`Start date time is blank`);
      }

      if (createEventDto.endDateTime === "") {
        throw new NotAcceptableException(`End date time is blank`);
      }

      if (createEventDto.startDateTime > createEventDto.endDateTime) {
        throw new NotAcceptableException(`Start date time must be before end date time`);
      }

      if (createEventDto.endDateTime < createEventDto.startDateTime) {
        throw new NotAcceptableException(`End date time must be after start date time`);
      }
      if (createEventDto.location === "") {
        throw new NotAcceptableException(`Location is blank`);
      }

      if (createEventDto.lat === null || createEventDto.lng === null) {
        throw new NotAcceptableException(`Location is invalid`);
      }

      if (createEventDto.lat < -90 || createEventDto.lat > 90) {
        throw new NotAcceptableException(`Latitude must be between -90 and 90`);
      }

      if (createEventDto.lng < -180 || createEventDto.lng > 180) {
        throw new NotAcceptableException(`Longitude must be between -180 and 180`);
      }

      if (createEventDto.isFree === null) {
        throw new NotAcceptableException(`Is free is blank`);
      }

      if (createEventDto.isFree === false && createEventDto.price === "") {
        throw new NotAcceptableException(`Price of paid event is blank`);
      }

      if (createEventDto.isFree === true && createEventDto.price !== "") {
        throw new NotAcceptableException(`Price of free event is not blank`);
      }

      if (Number(createEventDto.price) < 0){
        throw new NotAcceptableException(`Price must be greater than 0`);
      }


      const { imageUrl, ...dtoWithoutImage } = createEventDto;
      const event = this.eventRepository.create({
        ...dtoWithoutImage,
      } as DeepPartial<Event>);

      event.author = user;
      const newEvent = await this.eventRepository.save(event);

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

  async checkUserExist(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user) return true;
    else return false;
  }

  // find all published events
  async findAll({
    userId,
    searchString,
    category,
    pageNumber,
    pageSize,
    all
  }): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .innerJoinAndSelect('event.author', 'user');
    // filter by user
    if (userId) {
      const isUserExist = await this.checkUserExist(userId);
      if (!isUserExist) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      query.andWhere('event.author = :userId', { userId: userId });
      return query.getMany();
    }
    if (all) {
      query.skip((pageNumber - 1) * pageSize).take(pageSize);
      console.log(all);
      
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

  // find all events for admin
  async adminFindAll({ userId, searchString, category, pageNumber, pageSize }): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event')
      .innerJoinAndSelect('event.author', 'user');
    
    // filter by user
    if (userId) {
      query.andWhere('event.author = :userId', { userId: userId });
    }

    // filter by searchString
    if (searchString) {
      query.andWhere('(event.title LIKE :searchString OR event.description LIKE :searchString)', { searchString: `%${searchString}%` });
    }

    // filter by category
    if (category) {
      query.andWhere('event.categoryId = :category', { categoryId: category });
    }

    // pagination
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
    // find latest 3 events
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
  
    //update event
    async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
      const existingEvent = await this.eventRepository.findOne({ where: { id } });
  
      // get all followers of event
      const follower = await this.followeventRepository
        .createQueryBuilder('followevent')
        .innerJoinAndSelect('followevent.user', 'user')
        .where('followevent.eventId = :id', { id })
        .getMany();
  
      // check if event exist
      if (!existingEvent) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      
      // get category
      const category = await this.categoryRepository.findOne({
        where: { id: updateEventDto.category },
      });
  
      // check if category exist
      if (!category) {
        throw new NotFoundException(`Category is not exist!`);
      }
  
      // check if title is blank
      if (updateEventDto.title === ""|| updateEventDto.title === null) {
        throw new NotAcceptableException(`Title is blank or null`);
      }
  
      // check if category is blank
      if (updateEventDto.category === null) {
        throw new NotAcceptableException(`Category is blank`);
      }
  
      // check if description is blank
      if (updateEventDto.description === "") {
        throw new NotAcceptableException(`Description is blank`);
      }
  
      // check if start date time is blank
      if (updateEventDto.startDateTime === "") {
        throw new NotAcceptableException(`Start date time is blank`);
      }
  
      // check if end date time is blank
      if (updateEventDto.endDateTime === "") {
        throw new NotAcceptableException(`End date time is blank`);
      }
  
      // check if start date time is before end date time
      if (updateEventDto.startDateTime > updateEventDto.endDateTime) {
        throw new NotAcceptableException(`Start date time must be before end date time`);
      }
  
      // check if end date time is after start date time
      if (updateEventDto.endDateTime < updateEventDto.startDateTime) {
        throw new NotAcceptableException(`End date time must be after start date time`);
      }
  
      // check if location is blank
      if (updateEventDto.location === "") {
        throw new NotAcceptableException(`Location is blank`);
      }
  
      // check if location is invalid
      if (updateEventDto.lat === null || updateEventDto.lng === null) {
        throw new NotAcceptableException(`Location is invalid`);
      }
  
      // check if latitude is between -90 and 90
      if (updateEventDto.lat < -90 || updateEventDto.lat > 90) {
        throw new NotAcceptableException(`Latitude must be between -90 and 90`);
      }
  
      // check if longitude is between -180 and 180
      if (updateEventDto.lng < -180 || updateEventDto.lng > 180) {
        throw new NotAcceptableException(`Longitude must be between -180 and 180`);
      }
  
      // check if is free is blank
      if (updateEventDto.isFree === null) {
        throw new NotAcceptableException(`Is free is blank`);
      }
  
      // check if price of paid event is blank
      if (updateEventDto.isFree === false && (updateEventDto.price === null || updateEventDto.price === "") ) {
        throw new NotAcceptableException(`Price of paid event is blank`);
      }
  
      // check if price of free event is not blank
      if (updateEventDto.isFree === true && updateEventDto.price !== "") {
        throw new NotAcceptableException(`Price of free event is not blank`);
      }
  
      // check if price is greater than 0
      if (Number(updateEventDto.price) < 0){
        throw new NotAcceptableException(`Price must be greater than 0`);
      }
  
      // update event
      const { imageUrl, ...dtoWithoutImage } = updateEventDto;
      if (imageUrl) {
        await this.removeImagesByEventId(id);
        for (const image of imageUrl) {
          this.imageService.createImage(image, id, null);
        }
      }
      Object.assign(existingEvent, dtoWithoutImage);
  
      // send notification to followers of event is published
      if (existingEvent.isPublished) {
        if (follower.length > 0) {
          follower.forEach(async (follow) => {
            await this.MailerService.sendMail({
              to: follow.user.email,
              subject: 'Event Updated',
              html: `<head>
          <title>Event Updated Notification</title>
        </head>
        <body>
          <h1>Event Updated Notification</h1>
          <p>Hello, ${follow.user.firstName} ${follow.user.lastName}</p>
          <p>Your following event <strong>${existingEvent.title}</strong> has been updated. Click <a href="https://fusiongather.me/event/${existingEvent.id}">here</a> now to view detail and register yourself to be an attendee.</p>
          <p>Thank you!</p>
        </body>`,
            });
          });
        }
      }
      return await this.eventRepository.save(existingEvent);
    }
  
    //delete event
    async remove(id: number): Promise<void> {
      const eventToRemove = await this.eventRepository.findOne({ where: { id } });
  
      // check if event exist
      if (!eventToRemove) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }
      // get all booth of event
      const boothToRemove = await this.boothRepository
        .createQueryBuilder('booth')
        .where('booth.eventId = :id', { id })
        .getMany();
  
      // get all request of booth to remove
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
  
          // get all qrcode to remove
          const qrcodeToRemove = await this.qrCodeRepository
            .createQueryBuilder('qrcode')
            .where('qrcode.boothId = :id', { id: booth.id })
            .getOne();
  
          if (qrcodeToRemove) {
            await this.qrCodeRepository.remove(qrcodeToRemove);
          }
  
          // get all image of booth to remove
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
  
      // get all image, followevent, ticket, qrcode to remove
  
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
  
      // after all above removed, remove event
      await this.eventRepository.remove(eventToRemove);
    }
  
    // remove images by event id
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

  // get one event statistics
  async getEventStatistics(id: number, userId: number): Promise<EventStatisticDTO> {
    // check if user is owner of event
    const isEventExist = await this.eventRepository.findOne({
      where: { id: Equal(id) },
    });
 
    const isOwnerOfEvent = await this.eventRepository.findOne({
      where: { id: Equal(id), author: Equal(userId) },
    });
    if (!isEventExist) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (!isOwnerOfEvent) {
      throw new UnauthorizedException(`You are not owner of this event`);
    }

    // count total booths
    const totalBooths = await this.boothRepository.count({
      where: { eventId: Equal(id) },
    });

    // count total tickets
    const totalTickets = await this.ticketRepository.count({
      where: { eventId: Equal(id) },
    });

    // count total visitors
    const totalVisitors = await this.ticketRepository.count({
      where: { eventId: Equal(id),
              isScanned: true
      },
    });

    const event = await this.eventRepository.findOne({
      where: { id },
      select: ['price'],
    });
    //calculate event revenue
    const eventRevenue = totalTickets * Number(event.price);

    return {
      totalBooths,
      totalTickets,
      totalVisitors,
      eventRevenue
    };
  }

  // get total statistics of all events
  async getTotalStatistic(): Promise<TotalStatisticDTO> {
    const totalBooths = await this.boothRepository.count();
    const totalTickets = await this.ticketRepository.count();
    const totalVisitors = await this.ticketRepository.count({
      where: { isScanned: true },
    });
    const totalEvents = await this.eventRepository.count();
    const totalUsers = await this.userRepository.createQueryBuilder('user')
      .where('user.isAdmin = :isAdmin', { isAdmin: false })
      .getCount();
    return {
      totalBooths,
      totalTickets,
      totalVisitors,
      totalEvents,
      totalUsers,
    };
  }

  // find all pending events
  async findPendingEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: false });
    return query.getMany();
  }

  // find all published events
  async findPublishedEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    return query.getMany();
  }

  // publish event
  async publishEvent(id: number): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({ where: { id } });

    // check if event exist
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    // check if event is already published
    if (existingEvent.isPublished) {
      throw new NotAcceptableException(`Event is already published`);
    }
    // check if event start date has passed
    const currentDate = new Date().toISOString();
    if (existingEvent.startDateTime < currentDate) {
      throw new NotAcceptableException(`Event start date has passed`);
    }

    // get all followers of event
    const follower = await this.followeventRepository
      .createQueryBuilder('followevent')
      .innerJoinAndSelect('followevent.user', 'user')
      .where('followevent.eventId = :id', { id })
      .getMany();

    // get all vendor request of event
      const vendorRequest = await this.registerboothRepository.createQueryBuilder('registerbooth')
      .leftJoinAndSelect('registerbooth.user', 'user')
      .leftJoinAndSelect('registerbooth.booth', 'booth')
      .where('booth.eventId = :id', { id })
      .getMany();

    // get unique users
      const uniqueUsers = new Map<number, User>();
      vendorRequest.forEach(request => {
        uniqueUsers.set(request.user.id, request.user);
    });

    // set isPublished to true
    if (!existingEvent.isPublished) {
      existingEvent.isPublished = true;
    } 

    // send notification to followers and vendors
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

    // send notification to vendors
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

}