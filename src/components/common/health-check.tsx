'use client';

import { useAppControllerHealthCheckQuery } from '@/lib/quizlyApi';

export default function HealthCheck() {
  useAppControllerHealthCheckQuery();

  return null;
}
