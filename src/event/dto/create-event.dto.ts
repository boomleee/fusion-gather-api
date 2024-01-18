import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;
}
