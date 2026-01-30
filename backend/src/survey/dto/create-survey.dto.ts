import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldType } from '@/common/enums/field-type.enum';

export class CreateFieldDto {
  @IsString()
  label: string;

  @IsEnum(FieldType)
  fieldType: FieldType;

  @IsBoolean()
  isRequired: boolean;

  @IsArray()
  @IsOptional()
  options?: string[];
}

export class CreateSurveyDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  @ArrayMinSize(1)
  fields: CreateFieldDto[];
}
