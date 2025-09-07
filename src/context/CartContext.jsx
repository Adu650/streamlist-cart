/* Modded CartContext to include cross-tab synchronization and local storage persistence. Also*/
/* added limits to subscriptions. -- JC */  

import React, { createContext, useMemo, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { config } from '../app/config';

const CartContext = createContext(null);

const INITIAL = { items: [] }; // { id, title, price, type, qty, image }

function hasAnySubscription(items) {
  return (items ?? []).some(i => i.type === 'subscription');
}

function findSubscriptionIndex(items) {
  return (items ?? []).findIndex(i => i.type === 'subscription');
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { item } = action;
      const items = [...state.items];

      if (item.type === 'subscription') {
        const subIdx = findSubscriptionIndex(items);

        if (subIdx !== -1) {
          // already have a subscription
          if (items[subIdx].id === item.id) {
            // same plan → lock at 1, update metadata
            items[subIdx] = { ...items[subIdx], ...item, qty: 1 };
            return { ...state, items };
          }
          // different plan exists → block second sub
          return state;
        }

        // no subscription yet → add with qty 1
        items.push({ ...item, qty: 1, type: 'subscription' });
        return { ...state, items };
      }

      // non-subscription path
      const idx = items.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        items[idx] = { ...items[idx], ...item, qty: (items[idx].qty || 1) + (item.qty || 1) };
      } else {
        items.push({ ...item, qty: item.qty || 1 });
      }
      return { ...state, items };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };

    case 'SET_QTY': {
      const items = state.items.map(i => {
        if (i.id !== action.id) return i;
        if (i.type === 'subscription') return { ...i, qty: 1 }; // lock at 1
        return { ...i, qty: Math.max(1, action.qty) };
      });
      return { ...state, items };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [stored, setStored] = useLocalStorage(config.storageKey, INITIAL);
  const [state, dispatch] = useReducer(reducer, stored || INITIAL);

  // persist on each change
  useEffect(() => { setStored(state); }, [state, setStored]);

  const actions = useMemo(
    () => ({
      add: (item) => dispatch({ type: 'ADD', item }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    []
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
