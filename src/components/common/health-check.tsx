import serverFetch from '@/lib/server-fetch';

export default async function HealthCheck() {
  await serverFetch('/api/health');

  return null;
}
