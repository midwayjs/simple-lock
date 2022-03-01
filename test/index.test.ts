import * as assert from 'assert';
import SimpleLock from '../src';

describe('simple lock', () => {
  it('sureOnce should be ok', async () => {
    const lock = new SimpleLock();

    let i = 0;

    const arr = [
      lock.sureOnce(async () => {
        console.log(Date.now(), 44440);
        i++;
      }),
      lock.sureOnce(async () => {
        console.log(Date.now(), 44442);
        i++;
      }),
      lock.sureOnce(async () => {
        console.log(Date.now(), 44443);
        i++;
      }),
      lock.sureOnce(async () => {
        console.log(Date.now(), 44441);
        i++;
      }),
    ];

    await Promise.all(arr);
    assert(i === 1);
  });

  it('sureOnce throw error should be ok', async () => {
    const lock = new SimpleLock();

    let ee;
    try {
      await lock.sureOnce(async () => {
        (lock as any).q
          .get('_default_simple_lock_queue')
          .fns.push(() => console.log('test'));

        throw new Error('11');
      });
    } catch (e) {
      ee = e.message;
    }

    assert.deepEqual(ee, '11');
    assert.deepEqual(
      (lock as any).q.get('_default_simple_lock_queue').fns.length,
      0
    );
  });

  it('acquire should be ok', async () => {
    const lock = new SimpleLock();
    let i = 0;
    const data = [];

    const arr = [
      lock.acquire('hello', async () => {
        data.push(11);
        return i++;
      }),
      lock.acquire('hello', async () => {
        data.push(2);
        return i++;
      }),
      lock.acquire('hello', async () => {
        data.push(3);
        return i++;
      }),
    ];

    const rets = await Promise.all(arr);
    assert.deepEqual([0, 1, 2], rets);
    assert(3 === i);
    assert.deepEqual([11, 2, 3], data);
  });

  it('acquire throw error should be ok', async () => {
    const lock = new SimpleLock();

    let ee;
    try {
      await lock.acquire('hello', async () => {
        (lock as any).q.get('hello').fns.push(() => console.log('test'));

        throw new Error('11');
      });
    } catch (e) {
      ee = e.message;
    }

    assert.deepEqual(ee, '11');
    assert.deepEqual((lock as any).q.get('hello').fns.length, 0);
  });
});
