'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<ReturnType<typeof makeStore>>(makeStore);

  return <Provider store={store}>{children}</Provider>;
}
