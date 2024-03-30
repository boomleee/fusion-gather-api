import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FolloweventService } from './followevent.service';
import { CreateFolloweventDto } from './dto/create-followevent.dto';
import { UpdateFolloweventDto } from './dto/update-followevent.dto';

@Controller('followevent')
export class FolloweventController {
  constructor(private readonly followeventService: FolloweventService) {}

  @Post()
  create(@Body() createFolloweventDto: CreateFolloweventDto) {
    return this.followeventService.create(createFolloweventDto);
  }

  @Get()
  findAll() {
    return this.followeventService.findAll();
  }

  @Get('/count/:eventId')
  findFEventByEvent(@Param('eventId') eventId: string) {
    return this.followeventService.countUserFollowEvent(+eventId);
  }

  @Get(':userId/:eventId')
  findOneByUserAndEvent(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.followeventService.checkisUserFollowEvent(+userId, +eventId);
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.followeventService.findFEventByUser(+userId);
  }

  @Delete(':userId/:eventId')
  remove(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.followeventService.remove(+userId, +eventId);
  }
}
