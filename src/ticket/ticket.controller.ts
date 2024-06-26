/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorator/getUser.decorator';
import { User } from 'src/user/entities/user.entity';


@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get('event/:eventId')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  findOne(@Param('eventId') eventId: string, @GetUser() user: User) {
    return this.ticketService.findTicketByEventId(+eventId, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }

  @Post('create')
  create(@Body() createTicketDto: CreateTicketDto) {
    const newCreateTicketDto: CreateTicketDto = {
      eventId: Number(createTicketDto.eventId),
      userId: Number(createTicketDto.userId),
      isScanned: false
    };
    return this.ticketService.createTicketAfterSuccessfulPayment(newCreateTicketDto);
  }

  @Post('createFree')
  createFreeTicket(@Body() createTicketDto: CreateTicketDto) {
    const newCreateTicketDto: CreateTicketDto = {
      eventId: Number(createTicketDto.eventId),
      userId: Number(createTicketDto.userId),
      isScanned: false
    };
    return this.ticketService.createFreeTicket(newCreateTicketDto);
  }
}