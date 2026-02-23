import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { SurveyModule } from './survey/survey.module';
import { SurveyFieldEntity } from './survey/entities/survey-field.entity';
import { SurveyEntity } from './survey/entities/survey.entity';
import { SurveySubmissionEntity } from './survey/entities/survey-submission.entity';
import { SurveySubmissionAnswerEntity } from './survey/entities/survey-submission-answer.entity';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsModule } from './metrics/metrics.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpMetricsInterceptor } from './metrics/interceptors/httpMetrics.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register(), // /metrics is default endpoint for Prometheus metrics
    CommonModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/database.sqlite',
      entities: [
        UserEntity,
        SurveyEntity,
        SurveyFieldEntity,
        SurveySubmissionEntity,
        SurveySubmissionAnswerEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    SurveyModule,
    MetricsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpMetricsInterceptor,
    },
  ],
})
export class AppModule {}
