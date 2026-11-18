import assert from 'node:assert/strict';
import test from 'node:test';
import { readStorage, recordPlay, toggleFavorite } from '../src/services/storage';

test('a failed write keeps favorites and history for the rest of the page session', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  let stored = '{"favorites":[1],"history":[]}';
  const localStorage = {
    getItem: () => stored,
    setItem: (_key: string, value: string) => { stored = value; },
  };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage } });

  try {
    assert.deepEqual(toggleFavorite(2).favorites, [1, 2]);
    assert.deepEqual(JSON.parse(stored).favorites, [1, 2]);
    localStorage.setItem = () => { throw new Error('Storage quota exceeded'); };
    assert.equal(toggleFavorite(3).sessionOnly, true);
    assert.deepEqual(recordPlay(3).favorites, [1, 2, 3]);
    assert.equal(readStorage().history[0].id, 3);
    assert.deepEqual(JSON.parse(stored).favorites, [1, 2]);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
