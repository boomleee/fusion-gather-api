import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RegisterboothService } from './registerbooth.service';
import { CreateRegisterboothDto } from './dto/create-registerbooth.dto';
import { UpdateRegisterboothDto } from './dto/update-registerbooth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorator/getUser.decorator';
import { User } from 'src/user/entities/user.entity';

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
  @UseGuards(AuthGuard)
  findAllByEventId(@Param('eventid') eventid: string, @GetUser() user: User) {
    return this.registerboothService.findAllRequestByEventId(+eventid, user.id);
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
