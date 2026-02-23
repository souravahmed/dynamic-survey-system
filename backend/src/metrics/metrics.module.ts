import { Global, Module } from '@nestjs/common';
import {
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

// Define your metrics configuration in an array
const metrics = [
  makeCounterProvider({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'path', 'status'],
  }),
  makeHistogramProvider({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'path', 'status'],
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5], // Define typical response time buckets
  }),
  makeHistogramProvider({
    name: 'http_request_size_bytes',
    help: 'Size of HTTP requests in bytes',
    labelNames: ['method', 'path'],
    buckets: [100, 1000, 10000, 100000, 1000000],
  }),
];

@Global() // Makes metrics available everywhere without re-importing
@Module({
  providers: metrics,
  exports: metrics,
})
export class MetricsModule {}
