import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoothService } from './booth.service';
import { CreateBoothDto } from './dto/create-booth.dto';
import { UpdateBoothDto } from './dto/update-booth.dto';

@Controller('booth')
export class BoothController {
  constructor(private readonly boothService: BoothService) {}

  @Post()
  create(@Body() createBoothDto: CreateBoothDto) {
    return this.boothService.create(createBoothDto);
  }

  @Get()
  findAll() {
    return this.boothService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boothService.findOne(+id);
  }

  @Get('event/:id')
  findByEventId(@Param('id') id: string) {
    return this.boothService.findBoothsByEventId(+id);
  }

  @Get('user/:id')
  findByVendorId(@Param('id') id: string) {
    return this.boothService.findBoothsByVendorId(+id);
  }

  @Patch(':userId/:boothId')
  update(@Param('userId') userId: string, @Param('boothId') boothId: string, @Body() updateBoothDto: UpdateBoothDto) {
    return this.boothService.update(+userId, +boothId, updateBoothDto);
  }

  @Patch('assign/:userId/:boothId')
  assignBooth(@Param('userId') userId: string, @Param('boothId') boothId: string) {
    return this.boothService.assignBoothToUser(+userId, +boothId);
  }

  @Delete(':userId/:boothId')
  remove(@Param('userId') userId: string, @Param('boothId') boothId: string) {
    return this.boothService.remove(+userId, +boothId);
  }
}
