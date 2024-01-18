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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoothDto: UpdateBoothDto) {
    return this.boothService.update(+id, updateBoothDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boothService.remove(+id);
  }
}
