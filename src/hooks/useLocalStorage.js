/*modified storage hook so it updates, removes and has cross-tab sync capabilities -- JC */
import { useCallback, useEffect, useRef, useState } from 'react';
import { localStorageAdapter } from '../utils/storage/localStorageAdapter';

export function useLocalStorage(key, initialValue) {
  const ran = useRef(false);

  const read = () => {
    try {
      const v = localStorageAdapter.get(key);
      if (v !== undefined && v !== null) return v;
    } catch {}
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  };

  const [state, setState] = useState(read);

  // set() supports value or updater fn: set(v) or set(prev => next)
  const set = useCallback(
    (updater) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        try {
          if (next === undefined) {
            // remove key when given undefined
            if (localStorageAdapter.remove) localStorageAdapter.remove(key);
            else localStorageAdapter.set(key, null);
          } else {
            localStorageAdapter.set(key, next);
          }
        } catch {}
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    try {
      if (localStorageAdapter.remove) localStorageAdapter.remove(key);
      else localStorageAdapter.set(key, null);
    } catch {}
    setState(typeof initialValue === 'function' ? initialValue() : initialValue);
  }, [key, initialValue]);

  // keep in sync across tabs
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const onStorage = (e) => {
      if (e.storageArea !== window.localStorage) return;
      if (e.key !== key) return;
      try {
        const v = localStorageAdapter.get(key);
        setState(v ?? (typeof initialValue === 'function' ? initialValue() : initialValue));
      } catch {}
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue]);

  return [state, set, { remove }];
}
