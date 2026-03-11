'use client';

import { Button } from '@primereact/ui/button';
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount((prevCount) => prevCount + 1);
  }
  return (
    <>
      <div className="grid grid-cols-3 gap-4 justify-center my-auto">
        <h1 className="text-6xl text-center font-mono col-span-3">
          Welcome to Quizly! {'🎉'.repeat(count)}
        </h1>
        <Button className="col-start-2 col-span-1" onClick={handleClick}>
          🎉
        </Button>
      </div>
    </>
  );
}
