import StarPageButton from '@/components/start-page-button';

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 justify-center my-auto">
        <h1 className="text-6xl text-center font-mono col-span-3">Welcome to Quizly!</h1>
        <StarPageButton />
      </div>
    </>
  );
}
