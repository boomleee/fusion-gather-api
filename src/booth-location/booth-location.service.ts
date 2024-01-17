import { Injectable } from '@nestjs/common';
import { CreateBoothLocationDto } from './dto/create-booth-location.dto';
import { UpdateBoothLocationDto } from './dto/update-booth-location.dto';

@Injectable()
export class BoothLocationService {
  create(createBoothLocationDto: CreateBoothLocationDto) {
    return 'This action adds a new boothLocation';
  }

  findAll() {
    return `This action returns all boothLocation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} boothLocation`;
  }

  update(id: number, updateBoothLocationDto: UpdateBoothLocationDto) {
    return `This action updates a #${id} boothLocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} boothLocation`;
  }
}
