"use client";

import { useState } from "react";
import { Button } from "@heroui/button";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Button
      aria-label={`Increment counter, current count is ${count}`} // Added dynamic aria-label
      data-testid="btn-counter" // Added data-testid
      radius="full"
      onPress={() => setCount(count + 1)}
    >
      Count is {count}
    </Button>
  );
};
