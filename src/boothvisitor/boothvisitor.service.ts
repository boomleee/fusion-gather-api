import { Injectable } from '@nestjs/common';
import { CreateboothvisitorDto } from './dto/create-boothvisitor.dto';
import { UpdateBoothvisitorDto } from './dto/update-boothvisitor.dto';
import { Boothvisitor } from './entities/boothvisitor.entity';
import { Repository, DeepPartial, Equal } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Booth } from 'src/booth/entities/booth.entity';
interface BoothResult {
  id: number;
  name: string;
  count: number;
}
@Injectable()
export class BoothvisitorService {
  constructor(
    @InjectRepository(Boothvisitor)
    private readonly boothVisitorRepository: Repository<Boothvisitor>,
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
  ) {}
  create(createBoothvisitorDto: CreateboothvisitorDto) {}

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
  async visit(userId: number, boothId: number) {
    const record: DeepPartial<Boothvisitor> = {
      boothId: boothId,
      userId: userId,
    };
    return await this.boothVisitorRepository.save(record);
  }

  async getBoothMonitoring(eventId: number): Promise<BoothResult[]> {
    //get all booths(id, name)
    const booths = await this.boothRepository
      .createQueryBuilder('booth')
      .select(['booth.id', 'booth.name'])
      .where('booth.eventId = :eventId', { eventId: eventId })
      .getMany();

    const boothsWithCount: BoothResult[] = [];
    for (const booth of booths) {
      const count = await this.boothVisitorRepository
        .createQueryBuilder('boothVisitorRepository')
        .where('boothVisitorRepository.boothId = :boothId', {
          boothId: booth.id,
        })
        .getCount();

      boothsWithCount.push({
        id: booth.id,
        name: booth.name,
        count: count,
      });
    }

    return boothsWithCount;

    //count

    //return
  }
}
