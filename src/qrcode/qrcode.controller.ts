/* eslint-disable prettier/prettier */
import { Controller, Post, Param, NotFoundException, Get, InternalServerErrorException } from '@nestjs/common';
import { QrCodeService } from './qrcode.service';

@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post(':eventId')
  async generateQRCode(@Param('eventId') eventId: number) {
    try {
      const qrCodeImage = await this.qrCodeService.generateAndSaveQRCode(eventId);
      return qrCodeImage;
    } catch (error) {
      console.error('Error generating QR Code:', error);
      throw new NotFoundException('QR Code generation failed');
    }
  }
  
  @Get(':eventId')
  async getQRCodeData(@Param('eventId') eventId: string): Promise<any> {
    try {
      const qrCodeData = await this.qrCodeService.getQRCodeData(eventId);
      if (qrCodeData) {
        return qrCodeData;
      }
      throw new NotFoundException(`QR Code data not found for eventId ${eventId}`);
    } catch (error) {
      console.error('Error getting QR Code data:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}


