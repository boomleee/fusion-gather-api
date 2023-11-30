import { Module } from '@nestjs/common';
import { DummyService } from './dummy.service';
import { DummyController } from './dummy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dummy } from './entities/dummy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dummy])],
  controllers: [DummyController],
  providers: [DummyService],
})
export class DummyModule {}
