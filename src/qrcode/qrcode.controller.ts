import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post()
  create(@Body() createQrcodeDto: CreateQrcodeDto) {
    return this.qrcodeService.create(createQrcodeDto);
  }

  @Get()
  findAll() {
    return this.qrcodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qrcodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQrcodeDto: UpdateQrcodeDto) {
    return this.qrcodeService.update(+id, updateQrcodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qrcodeService.remove(+id);
  }
}
