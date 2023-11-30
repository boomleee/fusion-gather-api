/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException  } from '@nestjs/common';
import { CreateDummyDto } from './dto/create-dummy.dto';
import { UpdateDummyDto } from './dto/update-dummy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dummy } from './entities/dummy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DummyService {
  constructor(@InjectRepository(Dummy) private readonly dummyRepository: Repository<Dummy>) {}

 async create(createDummyDto: CreateDummyDto) {
    const dummy = this.dummyRepository.create(createDummyDto);

    return await this.dummyRepository.save(dummy);
  }

  async findAll(): Promise<Dummy[]> {
    return await this.dummyRepository.find();
  }

  async findOne(id: number) {
    const existingDummy = await this.dummyRepository.findOne({where: {id}});

    if (!existingDummy) {
      throw new NotFoundException(`Dummy with ID ${id} not found`);
    }

    return existingDummy;  
  }

  async update(id: number, updateDummyDto: UpdateDummyDto): Promise<Dummy> {
    const existingDummy = await this.dummyRepository.findOne({where: {id}});

    if (!existingDummy) {
      throw new NotFoundException(`Dummy with ID ${id} not found`);
    }
    Object.assign(existingDummy, updateDummyDto)

    return await this.dummyRepository.save(existingDummy);

  }

  async remove(id: number): Promise<void> {
    const dummyToRemove = await this.dummyRepository.findOne({where: {id}});

    if (!dummyToRemove) {
      throw new NotFoundException(`Dummy with ID ${id} not found`);
    }

    await this.dummyRepository.remove(dummyToRemove);
  }
}
