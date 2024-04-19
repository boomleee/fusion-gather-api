/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Qrcode } from './entities/qrcode.entity';
import { Event } from 'src/event/entities/event.entity';
import { Booth } from 'src/booth/entities/booth.entity';
import * as QRCode from 'qrcode';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(Qrcode)
    private readonly qrcodeRepository: Repository<Qrcode>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
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

  async generateAndSaveQRCodeForBooth(boothId): Promise<string> {
    try {
      // Truy xuất thông tin booth từ cơ sở dữ liệu
      const booth = await this.boothRepository
        .createQueryBuilder('booth')
        .where('booth.id = :boothId', { boothId })
        .getOne();

      if (!booth) {
        throw new Error('Booth not found');
      }

      // Kiểm tra xem QR Code đã được tạo cho Booth này chưa
      const existingQrCode = await this.qrcodeRepository
        .createQueryBuilder('qrcode')
        .where('qrcode.boothId = :boothId', { boothId })
        .getOne();

      if (existingQrCode != null) {
        // Nếu đã tồn tại QR Code cho Booth này, trả về mã QR Code đã có
        return await QRCode.toDataURL(existingQrCode);
      }

      // Nếu chưa có QR Code cho Booth này, tiếp tục tạo mới và lưu vào cơ sở dữ liệu
      const qrData = { boothId };
      const qrDataString = JSON.stringify(qrData);
      const qrCodeImage = await QRCode.toDataURL(qrDataString);

      const qrcode = new Qrcode();
      qrcode.qrCode = qrDataString;
      qrcode.boothId = boothId;
      await this.qrcodeRepository.save(qrcode);

      return qrCodeImage;
    } catch (error) {
      console.error('Error generating QR Code:', error);
      throw new Error('Internal Server Error');
    }
  }
  async generateAndSaveQRCodeForTicket(ticketId) {
    try {
      // Truy xuất thông tin booth từ cơ sở dữ liệu
      const ticket = await this.ticketRepository
        .createQueryBuilder('ticket')
        .where('ticket.id = :ticketId', { ticketId })
        .getOne();

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // Nếu chưa có QR Code cho Booth này, tiếp tục tạo mới và lưu vào cơ sở dữ liệu
      const qrData = { ticketId: ticketId };
      const qrDataString = JSON.stringify(qrData);
      const qrCodeImage = await QRCode.toDataURL(qrDataString);
      console.log('qrCodeString', qrDataString);

      return qrCodeImage;
    } catch (error) {
      console.error('Error generating QR Code:', error);
      throw new Error('Internal Server Error');
    }
  }

  async getQRCodeData(eventId): Promise<any> {
    try {
      // Truy xuất dữ liệu QRCode từ cơ sở dữ liệu
      const qrcode = await this.qrcodeRepository
        .createQueryBuilder('qrcode')
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

  async getQRCodeDataForBooth(boothId): Promise<any> {
    try {
      // Truy xuất dữ liệu QRCode từ cơ sở dữ liệu
      const qrcode = await this.qrcodeRepository
        .createQueryBuilder('qrcode')
        .where('qrcode.boothId = :boothId', { boothId })
        .getOne();
      if (qrcode) {
        const qrData = { boothId };
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

  async checkTicket(userId: number, ticketId: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId },
      relations: ['eventId', 'eventId.author'],
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket ${ticketId} not exist`);
    }
    if (ticket.eventId.author.id != userId) {
      throw new NotFoundException(
        `Ticket ${ticketId} not belong to your event`,
      );
    }
    if (ticket.isScanned == true) {
      throw new NotFoundException(`Ticket ${ticketId} has been scanned`);
    }
    ticket.isScanned = true;
    this.ticketRepository.save(ticket);
    return ticket;
  }
}
