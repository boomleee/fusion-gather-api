import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoothvisitorService } from './boothvisitor.service';
import { CreateboothvisitorDto } from './dto/create-boothvisitor.dto';
import { UpdateBoothvisitorDto } from './dto/update-boothvisitor.dto';

@Controller('boothvisitor')
export class BoothvisitorController {
  constructor(private readonly boothvisitorService: BoothvisitorService) {}

  @Post()
  create(@Body() createBoothvisitorDto: CreateboothvisitorDto) {
    return this.boothvisitorService.create(createBoothvisitorDto);
  }

  @Get()
  findAll() {
    return this.boothvisitorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boothvisitorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoothvisitorDto: UpdateBoothvisitorDto) {
    return this.boothvisitorService.update(+id, updateBoothvisitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boothvisitorService.remove(+id);
  }
}
