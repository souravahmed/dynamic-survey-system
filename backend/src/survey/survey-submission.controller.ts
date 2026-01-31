import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';
import { RolesGuard } from '@/common/guards/roles.guard';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { SurveySubmissionService } from './survey-submission.service';
import { CreateSurveySubmissionDto } from './dto/create-survey-submission.dto';
import { LoggedUser } from '@/common/decorators/logged-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { SurveySubmissionEntity } from './entities/survey-submission.entity';
import { PaginatedResponse } from '@/common/interfaces/paginated-response.interface';

@Controller('v1/survey-submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SurveySubmissionController {
  constructor(private surveySubmissionService: SurveySubmissionService) {}

  @Post()
  @Roles(UserRole.OFFICER)
  async createSubmission(
    @Body() createSurveySubmissionDto: CreateSurveySubmissionDto,
    @LoggedUser() loggedUser: JwtPayload,
  ): Promise<SurveySubmissionEntity> {
    return this.surveySubmissionService.createSubmission(
      createSurveySubmissionDto,
      loggedUser.email,
    );
  }

  @Get('survey')
  @Roles(UserRole.ADMIN)
  getSubmissionsBySurvey(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginatedResponse<SurveySubmissionEntity>> {
    return this.surveySubmissionService.getSubmissions(page, limit);
  }
}
