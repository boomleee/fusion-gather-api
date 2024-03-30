import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegisterboothService } from './registerbooth.service';
import { CreateRegisterboothDto } from './dto/create-registerbooth.dto';
import { UpdateRegisterboothDto } from './dto/update-registerbooth.dto';

@Controller('registerbooth')
export class RegisterboothController {
  constructor(private readonly registerboothService: RegisterboothService) {}

  @Post()
  create(@Body() createRegisterboothDto: CreateRegisterboothDto) {
    return this.registerboothService.create(createRegisterboothDto);
  }

  @Get()
  findAll() {
    return this.registerboothService.findAll();
  }

  @Get(':eventid')
  findAllByEventId(@Param('eventid') eventid: string) {
    return this.registerboothService.findAllRequestByEventId(+eventid);
  }

  @Get(':userid/:eventid')
  findAllByUserIdAndEventId(@Param('userid') userid: string, @Param('eventid') eventid: string) {
    return this.registerboothService.checkIsRegistered(+userid, +eventid);
  }

  @Delete(':userId/:boothId')
  remove(@Param('userId') userId: string, @Param('boothId') boothId: string) {
    return this.registerboothService.remove(+userId, +boothId);
  }
}
