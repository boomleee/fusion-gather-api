/* eslint-disable prettier/prettier */
import { Controller, Get,  Param, } from '@nestjs/common';
import { ImageService } from './image.service';
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
}
