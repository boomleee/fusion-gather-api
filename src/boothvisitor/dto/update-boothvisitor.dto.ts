import { PartialType } from '@nestjs/mapped-types';
import { CreateboothvisitorDto } from './create-boothvisitor.dto';

export class UpdateBoothvisitorDto extends PartialType(CreateboothvisitorDto) {}
