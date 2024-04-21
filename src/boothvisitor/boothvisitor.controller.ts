import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoothvisitorService } from './boothvisitor.service';
import { CreateboothvisitorDto } from './dto/create-boothvisitor.dto';
import { UpdateBoothvisitorDto } from './dto/update-boothvisitor.dto';
interface BoothResult {
  id: number;
  name: string;
  count: number;
}
@Controller('boothvisitor')
export class BoothvisitorController {
  constructor(private readonly boothvisitorService: BoothvisitorService) {}
  @Get('event/:eventId')
  getBoothMonitoring(
    @Param('eventId') eventId: string,
  ): Promise<BoothResult[]> {
    console.log(eventId);
    return this.boothvisitorService.getBoothMonitoring(+eventId);
  }
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
  update(
    @Param('id') id: string,
    @Body() updateBoothvisitorDto: UpdateBoothvisitorDto,
  ) {
    return this.boothvisitorService.update(+id, updateBoothvisitorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boothvisitorService.remove(+id);
  }

  @Get(':userId/:boothId')
  visitBooth(
    @Param('userId') userId: string,
    @Param('boothId') boothId: string,
  ) {
    return this.boothvisitorService.visit(+userId, +boothId);
  }
}
