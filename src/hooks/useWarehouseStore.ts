import { useState, useEffect } from 'react';
import { store } from '@/data/warehouseStore';

export function useWarehouseStore() {
  const [ver, setVer] = useState(store.version);
  
  useEffect(() => {
    const handler = () => setVer(store.version);
    const cleanup = store.subscribe(handler);
    return () => { cleanup(); };
  }, []);
  
  // Force component to re-read from store when version changes
  void ver;
  
  return store;
}
