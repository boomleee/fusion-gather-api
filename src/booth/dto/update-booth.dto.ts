import { PartialType } from '@nestjs/mapped-types';
import { CreateBoothDto } from './create-booth.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBoothDto extends PartialType(CreateBoothDto) {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    @IsOptional()
    @IsNumber()
    vendorId?: number;
}
