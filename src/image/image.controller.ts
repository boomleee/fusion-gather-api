/* eslint-disable prettier/prettier */
import { Controller, Get, Param,Patch, Body } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateImageUrlsDto } from './dto/update-image.dto';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/event/:eventId')
  findImagesByEventId(@Param('eventId') eventId: string) {
    return this.imageService.findImagesByEventId(+eventId);
  }

  @Get('/booth/:boothId')
  findImagesByBoothId(@Param('boothId') boothId: string) {
    return this.imageService.findImagesByBoothId(+boothId);
  }

  // @Delete('/event/:eventId')
  // async removeByEventId(@Param('eventId') eventId: string): Promise<void> {
  //   await this.imageService.removeImagesByEventId(+eventId);
  // }
  
  @Patch('/event/:eventId') 
  async updateImagebyEventId(@Param('eventId') eventId: string, @Body() updateImageUrlsDto: UpdateImageUrlsDto) {
    return this.imageService.updateImagebyEventId(+eventId, updateImageUrlsDto);
  }
}
