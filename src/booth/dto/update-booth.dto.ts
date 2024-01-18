import { PartialType } from '@nestjs/mapped-types';
import { CreateBoothDto } from './create-booth.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBoothDto extends PartialType(CreateBoothDto) {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
