import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as (typeof locales)[number])
    ? (requested as (typeof locales)[number])
    : undefined;

  if (!locale) notFound();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
