/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qrcode } from './entities/qrcode.entity';
import { Event } from 'src/event/entities/event.entity';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(Qrcode)
    private readonly qrcodeRepository: Repository<Qrcode>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async generateAndSaveQRCode(eventId): Promise<string> {
    try {
      // Kiểm tra xem QR Code đã được tạo cho EventID này chưa
      const existingQrCode = await this.qrcodeRepository
        .createQueryBuilder('qrcode')
        .where('qrcode.eventId = :eventId', { eventId })
        .getOne();

      if (existingQrCode != null) {
        // Nếu đã tồn tại QR Code cho EventID này, trả về mã QR Code đã có
        return await QRCode.toDataURL(existingQrCode);
      }

      // Nếu chưa có QR Code cho EventID này, tiếp tục tạo mới và lưu vào cơ sở dữ liệu
      const qrData = { eventId };
      const qrDataString = JSON.stringify(qrData);
      const qrCodeImage = await QRCode.toDataURL(qrDataString);

      const qrcode = new Qrcode();
      qrcode.qrCode = qrDataString;
      qrcode.eventId = eventId;
      await this.qrcodeRepository.save(qrcode);

      return qrCodeImage;
    } catch (error) {
      console.error('Error generating QR Code:', error);
      throw new Error('Internal Server Error');
    }
  }

  async getQRCodeData(eventId): Promise<any> {
    try {
      // Truy xuất dữ liệu QRCode từ cơ sở dữ liệu
      const qrcode = await this.qrcodeRepository.createQueryBuilder('qrcode')
      .where('qrcode.eventId = :eventId', { eventId })
      .getOne();
      if (qrcode) {
        const qrData = { eventId };
        const qrDataString = JSON.stringify(qrData);
        const qrCodeImage = await QRCode.toDataURL(qrDataString);  
        return qrCodeImage;      
      }

      return null;
    } catch (error) {
      console.error('Error getting QR Code data:', error);
      throw new Error('Internal Server Error');
    }
  }
}
