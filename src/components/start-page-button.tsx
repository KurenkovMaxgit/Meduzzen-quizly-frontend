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
      <span className='col-span-3 mb-4 text-center text-4xl'>{'🎉'.repeat(count)}</span>
      <Button className='col-span-1 col-start-2' onClick={handleClick}>
        🎉
      </Button>
    </>
  );
}
