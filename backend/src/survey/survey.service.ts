import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyEntity } from './entities/survey.entity';
import { SurveyFieldEntity } from './entities/survey-field.entity';
import { CreateSurveyDto, CreateFieldDto } from './dto/create-survey.dto';
import { UserService } from '@/user/user.service';
import { UserRole } from '@/common/enums/user-role.enum';
import { Stats } from './interfaces/stats.interface';

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
  ): Promise<SurveyEntity> {
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

  async getAllSurveys(role: UserRole): Promise<SurveyEntity[]> {
    if (role === UserRole.ADMIN) {
      return this.surveyRepository.find({
        relations: ['fields', 'createdBy'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.surveyRepository.find({
      where: { isActive: true },
      relations: ['fields'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStats(): Promise<Stats> {
    const [activeSurveys, totalOfficers] = await Promise.all([
      this.surveyRepository.count({ where: { isActive: true } }),
      this.userService.getTotalOfficers(),
    ]);

    return {
      activeSurveys,
      totalOfficers,
    };
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
