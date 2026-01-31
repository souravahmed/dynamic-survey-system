import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/common/enums/user-role.enum';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SurveySubmissionService } from './survey-submission.service';
import { CreateSurveySubmissionDto } from './dto/create-survey-submission.dto';
import { LoggedUser } from '@/common/decorators/logged-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

@Controller('v1/survey-submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SurveySubmissionController {
  constructor(private surveySubmissionService: SurveySubmissionService) {}

  @Post()
  @Roles(UserRole.OFFICER)
  async createSubmission(
    @Body() createSurveySubmissionDto: CreateSurveySubmissionDto,
    @LoggedUser() loggedUser: JwtPayload,
  ) {
    return this.surveySubmissionService.createSubmission(
      createSurveySubmissionDto,
      loggedUser.email,
    );
  }
}
