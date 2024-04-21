import { Injectable } from '@nestjs/common';
import { CreateboothvisitorDto } from './dto/create-boothvisitor.dto';
import { UpdateBoothvisitorDto } from './dto/update-boothvisitor.dto';

@Injectable()
export class BoothvisitorService {

  create(createBoothvisitorDto: CreateboothvisitorDto) {
    
  }

  findAll() {
    return `This action returns all boothvisitor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boothvisitor`;
  }

  update(id: number, updateBoothvisitorDto: UpdateBoothvisitorDto) {
    return `This action updates a #${id} boothvisitor`;
  }

  remove(id: number) {
    return `This action removes a #${id} boothvisitor`;
  }
}
