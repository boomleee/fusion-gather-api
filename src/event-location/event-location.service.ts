import { Injectable } from '@nestjs/common';
import { CreateEventLocationDto } from './dto/create-event-location.dto';
import { UpdateEventLocationDto } from './dto/update-event-location.dto';

@Injectable()
export class EventLocationService {
  create(createEventLocationDto: CreateEventLocationDto) {
    return 'This action adds a new eventLocation';
  }

  findAll() {
    return `This action returns all eventLocation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventLocation`;
  }

  update(id: number, updateEventLocationDto: UpdateEventLocationDto) {
    return `This action updates a #${id} eventLocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventLocation`;
  }
}
