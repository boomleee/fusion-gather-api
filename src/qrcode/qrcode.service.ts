import { Injectable } from '@nestjs/common';
import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';

@Injectable()
export class QrcodeService {
  create(createQrcodeDto: CreateQrcodeDto) {
    return 'This action adds a new qrcode';
  }

  findAll() {
    return `This action returns all qrcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qrcode`;
  }

  update(id: number, updateQrcodeDto: UpdateQrcodeDto) {
    return `This action updates a #${id} qrcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} qrcode`;
  }
}
