/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types'
import { CreateImageUrlsDto } from './create-image.dto'

export class UpdateImageUrlsDto extends PartialType(CreateImageUrlsDto) {}
