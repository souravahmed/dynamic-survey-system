import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveySubmissionEntity } from './entities/survey-submission.entity';
import { SurveySubmissionAnswerEntity } from './entities/survey-submission-answer.entity';
import { SurveyFieldEntity } from './entities/survey-field.entity';
import {
  AnswerDto,
  CreateSurveySubmissionDto,
} from './dto/create-survey-submission.dto';
import { SurveyService } from './survey.service';
import { UserService } from '@/user/user.service';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';

@Injectable()
export class SurveySubmissionService {
  constructor(
    @InjectRepository(SurveySubmissionEntity)
    private surveySubmissionRepository: Repository<SurveySubmissionEntity>,
    @InjectRepository(SurveySubmissionAnswerEntity)
    private answerRepository: Repository<SurveySubmissionAnswerEntity>,
    private surveyService: SurveyService,
    private userService: UserService,
  ) {}

  async createSubmission(
    createSubmissionDto: CreateSurveySubmissionDto,
    loggedUserEmail: string,
  ): Promise<SurveySubmissionEntity> {
    const { answers } = createSubmissionDto;

    const survey = await this.surveyService.getSurveyById(
      createSubmissionDto.surveyId,
    );

    if (!survey.isActive) {
      throw new BadRequestException(
        'This survey is no longer accepting responses',
      );
    }

    this.validateRequiredFields(survey.fields, answers);

    this.validateAnswerFields(survey.fields, answers);

    const user = await this.userService.getUserByEmail(loggedUserEmail);

    const submission = this.surveySubmissionRepository.create({
      surveyId: createSubmissionDto.surveyId,
      submittedById: user.id,
      submittedAt: new Date(),
    });

    const savedSubmission =
      await this.surveySubmissionRepository.save(submission);
    const { id: submissionId } = savedSubmission;

    await this.saveAnswers(submissionId, answers);

    return this.getSubmissionById(submissionId);
  }

  private async saveAnswers(
    submissionId: string,
    dtoAnswers: AnswerDto[],
  ): Promise<void> {
    const answers = dtoAnswers.map((answer) =>
      this.answerRepository.create({
        submissionId,
        fieldId: answer.fieldId,
        value: answer.value,
      }),
    );

    await this.answerRepository.save(answers);
  }

  private validateRequiredFields(
    fields: SurveyFieldEntity[],
    answers: AnswerDto[],
  ): void {
    const requiredFields = fields.filter((field) => field.isRequired);
    const answeredFieldIds = answers.map((answer) => answer.fieldId);

    for (const requiredField of requiredFields) {
      if (!answeredFieldIds.includes(requiredField.id)) {
        throw new BadRequestException(
          `Field "${requiredField.label}" is required`,
        );
      }
    }
  }

  private validateAnswerFields(
    fields: SurveyFieldEntity[],
    dtoAnswers: AnswerDto[],
  ): void {
    const surveyFieldIds = fields.map((field) => field.id);
    for (const answer of dtoAnswers) {
      if (!surveyFieldIds.includes(answer.fieldId)) {
        throw new BadRequestException(`Invalid field ID: ${answer.fieldId}`);
      }
    }
  }

  async getSubmissionById(id: string): Promise<SurveySubmissionEntity> {
    const submission = await this.surveySubmissionRepository.findOne({
      where: { id },
      relations: ['answers', 'answers.field', 'submittedBy', 'survey'],
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async getSubmissions(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<SurveySubmissionEntity>> {
    const skip = (page - 1) * limit;

    const [submissions, total] =
      await this.surveySubmissionRepository.findAndCount({
        where: {},
        relations: ['answers', 'answers.field', 'submittedBy', 'survey'],
        order: { submittedAt: 'DESC' },
        skip,
        take: limit,
      });

    return {
      data: submissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
