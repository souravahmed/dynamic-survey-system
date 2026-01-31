import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { UserRole } from '@/common/enums/user-role.enum';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { LoggedUser } from '@/common/decorators/logged-user.decorator';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';
import { SurveyEntity } from './entities/survey.entity';
import { Stats } from './interfaces/stats.interface';

@Controller('v1/surveys')
export class SurveyController {
  constructor(private surveyService: SurveyService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createSurvey(
    @Body() createSurveyDto: CreateSurveyDto,
    @LoggedUser() loggedUser: JwtPayload,
  ): Promise<SurveyEntity> {
    return this.surveyService.createSurvey(createSurveyDto, loggedUser.email);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(): Promise<Stats> {
    return this.surveyService.getStats();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllSurveys(
    @LoggedUser() loggedUser: JwtPayload,
  ): Promise<SurveyEntity[]> {
    return this.surveyService.getAllSurveys(loggedUser.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSurveyById(@Param('id') id: string): Promise<SurveyEntity> {
    return this.surveyService.getSurveyById(id);
  }
}
