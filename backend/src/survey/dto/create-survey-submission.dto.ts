import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsString()
  fieldId: string;

  @IsString()
  value: string; // Can be JSON string for multiple values
}

export class CreateSurveySubmissionDto {
  @IsString()
  surveyId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  @ArrayMinSize(1)
  answers: AnswerDto[];
}
