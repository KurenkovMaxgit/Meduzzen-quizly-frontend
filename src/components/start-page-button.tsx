'use client';

import { Button } from '@primereact/ui/button';
import { useState } from 'react';

export default function StarPageButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount((prevCount) => prevCount + 1);
  }
  return (
    <>
      <span className="text-4xl text-center col-span-3 mb-4">{'🎉'.repeat(count)}</span>
      <Button className="col-start-2 col-span-1" onClick={handleClick}>
        🎉
      </Button>
    </>
  );
}
