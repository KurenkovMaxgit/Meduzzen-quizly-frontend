import StarPageButton from '@/components/start-page-button';

export default function HomePage() {
  //TODO: Add Welcome text with crucial pages routing
  return (
    <div className='my-auto grid grid-cols-3 justify-center gap-4'>
      <h1 className='col-span-3 text-center font-mono text-6xl'>Welcome to Quizly!</h1>
      <StarPageButton />
    </div>
  );
}
