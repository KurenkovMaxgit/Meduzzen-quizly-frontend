import { serverFetch } from '@/lib/server-fetch';

export async function HealthCheck() {
  await serverFetch('/api/health');

  return null;
}
