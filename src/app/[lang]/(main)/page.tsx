import { HomePageTiles } from '@/components/home/home-page-tiles';
import { getDictionary } from '@/utils/get-dictionary';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const dictionary = await getDictionary((await params).lang);

  return (
    <div className='bg-surface-50 dark:bg-surface-950 flex min-h-[80vh] flex-col items-center justify-center px-4 py-12'>
      <div className='mb-12 max-w-2xl text-center'>
        <h1 className='text-surface-900 dark:text-surface-0 mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl'>
          {dictionary.home.welcome}
        </h1>
        <p className='text-surface-600 dark:text-surface-400 text-lg leading-relaxed'>
          {dictionary.home.description}
        </p>
      </div>
      <HomePageTiles />
    </div>
  );
}
