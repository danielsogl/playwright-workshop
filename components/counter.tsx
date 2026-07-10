'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Button
      aria-label={`Increment counter, current count is ${count}`}
      className="rounded-full"
      onPress={() => setCount(count + 1)}
    >
      Count is {count}
    </Button>
  );
};
