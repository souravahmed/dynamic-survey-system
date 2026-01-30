import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyEntity } from './entities/survey.entity';
import { SurveyFieldEntity } from './entities/survey-field.entity';
import { CreateSurveyDto, CreateFieldDto } from './dto/create-survey.dto';
import { UserService } from '@/user/user.service';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(SurveyFieldEntity)
    private surveyFieldRepository: Repository<SurveyFieldEntity>,
    private userService: UserService,
  ) {}

  async createSurvey(
    createSurveyDto: CreateSurveyDto,
    loggedUserEmail: string,
  ) {
    const loggedUser = await this.userService.getUserByEmail(loggedUserEmail);

    const survey = this.surveyRepository.create({
      title: createSurveyDto.title,
      description: createSurveyDto.description,
      createdById: loggedUser.id,
    });

    const savedSurvey = await this.surveyRepository.save(survey);

    await this.createSurveyField(savedSurvey.id, createSurveyDto.fields);

    return this.getSurveyById(savedSurvey.id);
  }

  async getSurveyById(id: string) {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['fields', 'createdBy'],
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    return survey;
  }

  private async createSurveyField(
    surveyId: string,
    dtoFields: CreateFieldDto[],
  ): Promise<void> {
    const fields = dtoFields.map((field) =>
      this.surveyFieldRepository.create({
        ...field,
        surveyId: surveyId,
      }),
    );

    await this.surveyFieldRepository.save(fields);
  }
}
