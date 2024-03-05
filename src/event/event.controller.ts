
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

  @Get('/pending')
  findPendingEvents() {
    return this.eventService.findIsFreeEvent();
  }

  @Get()
  findAll(
    @Query('searchString') searchString: string = "",
    @Query('userId') userId: number,
    @Query('category') category: string = "",
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.eventService.findAll({ userId, searchString, category, pageNumber, pageSize });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }

}
