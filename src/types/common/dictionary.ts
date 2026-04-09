import { getMessages } from 'next-intl/server';

export type Dictionary = Awaited<ReturnType<typeof getMessages>>;
