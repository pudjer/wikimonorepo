/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Autorun } from "./autorun";


const flushPromises = () => new Promise<void>(resolve => queueMicrotask(resolve));

describe("reaction method", () => {
  let ar: Autorun;
  
  beforeEach(() => {
    ar = new Autorun();
  });

  describe("basic functionality", () => {
    it("should execute tracking function and return its result", () => {
      const tracking = vi.fn(() => 42);
      const reaction = vi.fn();
      
      const { result, dispose } = ar.reaction(tracking, reaction);
      
      expect(tracking).toHaveBeenCalledTimes(1);
      expect(result).toBe(42);
      expect(reaction).not.toHaveBeenCalled(); // reaction shouldn't run immediately
      expect(dispose).toBeDefined();
      expect(typeof dispose).toBe("function");
    });

    it("should return the correct result type", () => {
      const tracking = vi.fn(() => "test string");
      const reaction = vi.fn();
      
      const { result } = ar.reaction(tracking, reaction);
      
      expect(result).toBe("test string");
    });

    it("should handle tracking function returning complex objects", () => {
      const complexObject = { a: 1, b: { c: 2 } };
      const tracking = vi.fn(() => complexObject);
      const reaction = vi.fn();
      
      const { result } = ar.reaction(tracking, reaction);
      
      expect(result).toEqual(complexObject);
    });
  });

  describe("reaction triggering", () => {
    it("should trigger reaction when tracked property changes", () => {
      const obj = ar.registerObject({ count: 0, name: "test" });
      const reaction = vi.fn();
      
      ar.reaction(
        () => obj.count,
        reaction
      );
      
      expect(reaction).not.toHaveBeenCalled();
      
      obj.count = 1;
      
      // Need to wait for microtasks (deduplicator uses Promise)
      return Promise.resolve().then(() => {
        expect(reaction).toHaveBeenCalledTimes(1);
      });
    });

    it("should NOT trigger reaction when non-tracked property changes", () => {
      const obj = ar.registerObject({ count: 0, name: "test" });
      const reaction = vi.fn();
      
      ar.reaction(
        () => obj.count,
        reaction
      );
      
      obj.name = "changed";
      
      return Promise.resolve().then(() => {
        expect(reaction).not.toHaveBeenCalled();
      });
    });

    it("should trigger reaction for multiple tracked properties", () => {
      const obj = ar.registerObject({ count: 0, name: "test", active: true });
      const reaction = vi.fn();
      
      ar.reaction(
        () => {
          return { count: obj.count, active: obj.active };
        },
        reaction
      );
      
      obj.count = 1;
      
      return Promise.resolve()
        .then(() => {
          expect(reaction).toHaveBeenCalledTimes(1);
          reaction.mockClear();
          
          obj.active = false;
          
          return Promise.resolve();
        })
        .then(() => {
          expect(reaction).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe("dispose functionality", () => {
    it("should stop reactions after dispose is called", () => {
      const obj = ar.registerObject({ count: 0 });
      const reaction = vi.fn();
      
      const { dispose } = ar.reaction(
        () => obj.count,
        reaction
      );
      
      obj.count = 1;
      
      return Promise.resolve()
        .then(() => {
          expect(reaction).toHaveBeenCalledTimes(1);
          reaction.mockClear();
          
          dispose();
          
          obj.count = 2;
          
          return Promise.resolve();
        })
        .then(() => {
          expect(reaction).not.toHaveBeenCalled();
        });
    });

    it("should be safe to call dispose multiple times", () => {
      const obj = ar.registerObject({ count: 0 });
      const reaction = vi.fn();
      
      const { dispose } = ar.reaction(
        () => obj.count,
        reaction
      );
      
      dispose();
      dispose(); // Should not throw
      
      obj.count = 1;
      
      return Promise.resolve().then(() => {
        expect(reaction).not.toHaveBeenCalled();
      });
    });
  });

  describe("multiple reactions", () => {
    it("should handle multiple reactions on same property", () => {
      const obj = ar.registerObject({ count: 0 });
      const reaction1 = vi.fn();
      const reaction2 = vi.fn();
      
      ar.reaction(() => obj.count, reaction1);
      ar.reaction(() => obj.count, reaction2);
      
      obj.count = 1;
      
      return Promise.resolve().then(() => {
        expect(reaction1).toHaveBeenCalledTimes(1);
        expect(reaction2).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle independent disposal of multiple reactions", () => {
      const obj = ar.registerObject({ count: 0 });
      const reaction1 = vi.fn();
      const reaction2 = vi.fn();
      
      const { dispose: dispose1 } = ar.reaction(() => obj.count, reaction1);
      const { dispose: dispose2 } = ar.reaction(() => obj.count, reaction2);
      
      dispose1();
      
      obj.count = 1;
      
      return Promise.resolve().then(() => {
        expect(reaction1).not.toHaveBeenCalled();
        expect(reaction2).toHaveBeenCalledTimes(1);
        
        dispose2();
      });
    });
  });

  describe("error handling", () => {
    it("should handle errors in tracking function", () => {
      const error = new Error("Tracking error");
      const tracking = vi.fn(() => {
        throw error;
      });
      const reaction = vi.fn();
      
      expect(() => {
        ar.reaction(tracking, reaction);
      }).toThrow(error);
      
      expect(reaction).not.toHaveBeenCalled();
    });
  

  describe("nested reactions", () => {
    it("should handle reactions that trigger other reactions", () => {
      const obj1 = ar.registerObject({ value: 0 });
      const obj2 = ar.registerObject({ value: 0 });
      const reaction2 = vi.fn();
      
      ar.reaction(
        () => obj1.value,
        () => {
          obj2.value = obj1.value;
        }
      );
      
      ar.reaction(() => obj2.value, reaction2);
      
      obj1.value = 5;
      
      return Promise.resolve()
        .then(() => Promise.resolve()) // Allow nested reaction to propagate
        .then(() => {
          expect(obj2.value).toBe(5);
          expect(reaction2).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe("deduplication", () => {
    it("should deduplicate multiple rapid changes to same property", () => {
      const obj = ar.registerObject({ count: 0 });
      const reaction = vi.fn();
      
      ar.reaction(() => obj.count, reaction);
      
      obj.count = 1;
      obj.count = 2;
      obj.count = 3;
      
      return Promise.resolve().then(() => {
        // Should only trigger once (or at least fewer than 3 times)
        expect(reaction).toHaveBeenCalledTimes(1);
      });
    });

    it("should trigger reaction after all synchronous changes", () => {
      const obj = ar.registerObject({ count: 0, name: "test" });
      const reaction = vi.fn();
      
      ar.reaction(() => ({ count: obj.count, name: obj.name }), reaction);
      
      obj.count = 1;
      obj.name = "changed";
      obj.count = 2;
      
      return Promise.resolve().then(() => {
        expect(reaction).toHaveBeenCalledTimes(1);
      });
    });
  });

  
  });
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
})