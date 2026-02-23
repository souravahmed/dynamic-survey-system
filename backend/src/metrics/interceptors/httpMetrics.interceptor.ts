/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly durationMetric: Histogram<string>,
    @InjectMetric('http_requests_total')
    private readonly countMetric: Counter<string>,
    @InjectMetric('http_request_size_bytes')
    private readonly sizeMetric: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, route, url } = request;
    // Use 'route.path' if available to avoid "cardinality explosion" (e.g., /users/:id instead of /users/1)
    const path = route?.path || url;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () =>
          this.logAndMetrics(
            method,
            path,
            response.statusCode,
            startTime,
            response,
          ),
        error: (err) =>
          this.logAndMetrics(
            method,
            path,
            err.status || 500,
            startTime,
            response,
          ),
      }),
    );
  }

  private logAndMetrics(
    method: string,
    path: string,
    status: number,
    startTime: number,
    response: any,
  ) {
    const duration = (Date.now() - startTime) / 1000;
    const size = parseInt(response.get('Content-Length') || '0', 10);

    // 1. Prometheus Metrics (The "Useful" Trio)
    this.countMetric.inc({ method, path, status });
    this.durationMetric.observe({ method, path, status }, duration);
    this.sizeMetric.observe({ method, path }, size);

    // 2. Console Log
    this.logger.log(
      `${method} ${path} ${status} - ${Math.round(duration * 1000)}ms`,
    );
  }
}
