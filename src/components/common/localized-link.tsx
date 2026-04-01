'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

export default function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  const segments = pathname.split('/');
  const locales = ['en', 'uk'];
  const currentLang = locales.includes(segments[1]) ? segments[1] : 'en';

  const isInternal = typeof href === 'string' && href.startsWith('/');

  const needsPrefix = isInternal && currentLang !== 'en' && !href.startsWith(`/${currentLang}`);
  const localizedHref = needsPrefix ? `/${currentLang}${href}` : href;

  return <Link {...props} href={localizedHref} />;
}
