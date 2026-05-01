import { describe, it, expect, vi, beforeEach } from "vitest";
import { Autorun } from "./autorun";


const flushPromises = () => new Promise<void>(resolve => queueMicrotask(resolve));

describe("Autorun", () => {
  let ar: Autorun;

  beforeEach(() => {
    ar = new Autorun() as any;
  });

  it("runs autorun once on initial subscription", async () => {
    const state = ar.registerObject({ count: 0 });

    let runs = 0;

    ar.autorun(() => {
      runs++;
      void state.count;
    });

    await flushPromises();

    expect(runs).toBe(1);
  });

  it("batches synchronous changes into single rerun", async () => {
    const state = ar.registerObject({ count: 0 });

    let runs = 0;

    ar.autorun(() => {
      runs++;
      void state.count;
    });

    state.count++;
    state.count++;
    state.count++;

    await flushPromises();

    state.count++;
    state.count++;
    state.count++;

    await flushPromises();

    expect(runs).toBe(2); // init + one batched update
  });

  it("does not rerun multiple times in same sync tick", async () => {
    const state = ar.registerObject({ a: 1, b: 1 });

    let runs = 0;

    ar.autorun(() => {
      runs++;
      void state.a;
      void state.b;
    });

    state.a = 2;
    state.b = 2;
    state.a = 3;

    await flushPromises();

    state.a = 2;
    state.b = 2;
    state.a = 3;

    await flushPromises();

    expect(runs).toBe(2);
  });

  it("inner autorun reacts independently of outer autorun batching", async () => {
    const state = ar.registerObject({ x: 0 });

    let outerRuns = 0;
    let innerRuns = 0;

    ar.autorun(() => {
      outerRuns++;
      void state.x;

      ar.autorun(() => {
        innerRuns++;
        void state.x;
      });
    });

    await flushPromises();

    state.x++;
    state.x++;

    await flushPromises();

    expect(innerRuns).toBeGreaterThanOrEqual(2);
    expect(outerRuns).toBeLessThanOrEqual(3);
  });

  it("self-triggering autorun does not cause infinite loop", async () => {
    const state = ar.registerObject({ n: 0 });

    let runs = 0;

    ar.autorun(() => {
      runs++;
      if (state.n < 10) {
        state.n++;
      }
      void state.n;
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(runs).toBe(11);
  });

  it("inner dispose", async () => {
    const state = ar.registerObject({ n: 0 });

    let runs = 0;

    ar.autorun((dispose) => {
      runs++;
      state.n++;
      void state.n;
      if (state.n === 10) {
        dispose();
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(runs).toBe(11);
  });

  it("dispose stops autorun completely", async () => {
    const state = ar.registerObject({ v: 0 });

    let runs = 0;

    const dispose = ar.autorun(() => {
      runs++;
      void state.v;
    });

    await flushPromises();

    dispose();

    state.v++;

    await flushPromises();

    const after = runs;

    state.v++;

    await flushPromises();

    expect(runs).toBe(after);
  });



  it("multiple synchronous updates trigger autorun only once per batch (promise boundary)", async () => {
    const state = ar.registerObject({ p: 0 });

    let runs = 0;

    ar.autorun(() => {
      runs++;
      void state.p;
    });

    state.p++;
    state.p++;

    await Promise.resolve();
    await Promise.resolve();

    expect(runs).toBe(1);
  });
});