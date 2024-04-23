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

  // Generate and save QR Code for an Event
  async generateAndSaveQRCode(eventId): Promise<string> {
    try {
      // Check if QR Code has been generated for this EventID
      const existingQrCode = await this.qrcodeRepository
        .createQueryBuilder('qrcode')
        .where('qrcode.eventId = :eventId', { eventId })
        .getOne();

      if (existingQrCode != null) {
        // If QR Code exists for this EventID, return the existing QR Code
        return await QRCode.toDataURL(existingQrCode);
      }

      // If QR Code does not exist for this EventID, continue to generate and save to the database
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

  // Generate and save QR Code for a Booth
  async generateAndSaveQRCodeForBooth(boothId): Promise<string> {
    try {
      // Fetch booth information from the database
      const booth = await this.boothRepository
        .createQueryBuilder('booth')
        .where('booth.id = :boothId', { boothId })
        .getOne();

      if (!booth) {
        throw new Error('Booth not found');
      }

      // Check if QR Code has been generated for this Booth
      const existingQrCode = await this.qrcodeRepository
        .createQueryBuilder('qrcode')
        .where('qrcode.boothId = :boothId', { boothId })
        .getOne();

      if (existingQrCode != null) {
        // If QR Code exists for this Booth, return the existing QR Code
        return await QRCode.toDataURL(existingQrCode);
      }

      // If QR Code does not exist for this Booth, continue to generate and save to the database
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

  // Generate and save QR Code for a Ticket
  async generateAndSaveQRCodeForTicket(ticketId) {
    try {
      // Fetch ticket information from the database
      const ticket = await this.ticketRepository
        .createQueryBuilder('ticket')
        .where('ticket.id = :ticketId', { ticketId })
        .getOne();

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      // If QR Code does not exist for this Ticket, continue to generate and save to the database
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

  // Get QR Code data for an Event
  async getQRCodeData(eventId): Promise<any> {
    try {
      // Fetch QRCode data from the database
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

  // Get QR Code data for a Booth
  async getQRCodeDataForBooth(boothId): Promise<any> {
    try {
      // Fetch QRCode data from the database
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

  // Check ticket and mark it as scanned
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
