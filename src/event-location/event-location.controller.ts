import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventLocationService } from './event-location.service';
import { CreateEventLocationDto } from './dto/create-event-location.dto';
import { UpdateEventLocationDto } from './dto/update-event-location.dto';

@Controller('event-location')
export class EventLocationController {
  constructor(private readonly eventLocationService: EventLocationService) {}

  @Post()
  create(@Body() createEventLocationDto: CreateEventLocationDto) {
    return this.eventLocationService.create(createEventLocationDto);
  }

  @Get()
  findAll() {
    return this.eventLocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventLocationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventLocationDto: UpdateEventLocationDto) {
    return this.eventLocationService.update(+id, updateEventLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventLocationService.remove(+id);
  }
}
