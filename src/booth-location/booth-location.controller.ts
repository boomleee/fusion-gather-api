import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoothLocationService } from './booth-location.service';
import { CreateBoothLocationDto } from './dto/create-booth-location.dto';
import { UpdateBoothLocationDto } from './dto/update-booth-location.dto';

@Controller('booth-location')
export class BoothLocationController {
  constructor(private readonly boothLocationService: BoothLocationService) {}

  @Post()
  create(@Body() createBoothLocationDto: CreateBoothLocationDto) {
    return this.boothLocationService.create(createBoothLocationDto);
  }

  @Get()
  findAll() {
    return this.boothLocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boothLocationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoothLocationDto: UpdateBoothLocationDto) {
    return this.boothLocationService.update(+id, updateBoothLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boothLocationService.remove(+id);
  }
}
