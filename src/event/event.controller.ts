/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetUser } from 'src/decorator/getUser.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/entities/user.entity';


@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @UseGuards(AuthGuard)
  @Post('/create')
  create(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User
  ) {
    return this.eventService.create(createEventDto, user);
  }

  @Get('statistics/total')
  getTotalStatistics() {
    return this.eventService.getTotalStatistic();
  }
  
  @Get('/pending')
  findPendingEvents() {
    return this.eventService.findPendingEvent();
  }

  @Get("/latest")
  findLatestEvent() {
    return this.eventService.findLatestEvent();
  }

  @Get('/published')
  findPublishedEvents() {
    return this.eventService.findPublishedEvent();
  }

  @Post('/publishEvent/:id')
  publishEvent(@Param('id') id: string) {
    return this.eventService.publishEvent(+id);
  }

  @Get()
  findAll(
    @Query('searchString') searchString: string = "",
    @Query('userId') userId: number,
    @Query('category') category: string = "",
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('all') all: string = ""
  ) {
    return this.eventService.findAll({ userId, searchString, category, pageNumber, pageSize, all});
  }

  @Get('/admin')
  adminFindAll(
    @Query('searchString') searchString: string = "",
    @Query('userId') userId: number,
    @Query('category') category: string = "",
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.eventService.adminFindAll({ userId, searchString, category, pageNumber, pageSize});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Get('statistics/:id')
  @UseGuards(AuthGuard)
  getEventStatistics(@Param('id') id: string, @GetUser() user: User){
    return this.eventService.getEventStatistics(+id, user.id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }

  @Delete(':id/images')
  removeImagesByEventId(@Param('id') id: string) {
    return this.eventService.removeImagesByEventId(+id);
  }
}