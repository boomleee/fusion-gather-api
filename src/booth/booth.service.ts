import { Injectable } from '@nestjs/common';
import { CreateBoothDto } from './dto/create-booth.dto';
import { UpdateBoothDto } from './dto/update-booth.dto';

@Injectable()
export class BoothService {
  create(createBoothDto: CreateBoothDto) {
    return 'This action adds a new booth';
  }

  findAll() {
    return `This action returns all booth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booth`;
  }

  update(id: number, updateBoothDto: UpdateBoothDto) {
    return `This action updates a #${id} booth`;
  }

  remove(id: number) {
    return `This action removes a #${id} booth`;
  }
}
