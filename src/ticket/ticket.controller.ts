/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';


@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get('event/:eventId/:userId')
  @UsePipes(ValidationPipe)
  findOne(@Param('eventId') eventId: string, @Param('userId') userId: string) {
    return this.ticketService.findTicketByEventId(+eventId, +userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}