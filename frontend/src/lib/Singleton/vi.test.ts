import { describe, it, expect } from 'vitest';
import { BuildRule, Resolver } from './Resolver';

// -------- Test types and rules --------

interface MyObject {
  id: string;
  data?: string;
  other?: MyObject;
}

type MyKey = string;

// Simple rule without dependencies
const simpleRule: BuildRule<MyObject, string, MyKey> = {
  allocate(key) {
    return { id: key };
  },
  async fetch(key) {
    return `data-for-${key}`;
  },
  async update(target, data) {
    target.data = data;
  },
};

// Rules that depend on each other (cycle test)
const ruleB: BuildRule<MyObject, string, string> = {
  allocate(key) {
    return { id: key };
  },
  async fetch(key) {
    return `data-for-${key}`;
  },
  async update(target, data, resolve) {
    target.data = data;
    // B depends on A
    target.other = await resolve('a', ruleA);
  },
};

const ruleA: BuildRule<MyObject, string, string> = {
  allocate(key) {
    return { id: key };
  },
  async fetch(key) {
    return `data-for-${key}`;
  },
  async update(target, data, resolve) {
    target.data = data;
    // A depends on B
    target.other = await resolve('b', ruleB);
  },
};

// -------- Tests --------

describe('Resolver', () => {
  describe('resolveOutside', () => {
    it('resolves an object and populates it with data', async () => {
      const resolver = new Resolver();
      const obj = await resolver.resolveOutside('x', simpleRule);

      expect(obj.id).toBe('x');
      expect(obj.data).toBe('data-for-x');
    });

    it('returns the identical object for the same key and rule', async () => {
      const resolver = new Resolver();
      const a = await resolver.resolveOutside('k', simpleRule);
      const b = await resolver.resolveOutside('k', simpleRule);

      expect(a).toBe(b);
    });

    it('handles cycles without deadlock', async () => {
      const resolver = new Resolver();
      const objA = await resolver.resolveOutside('a', ruleA);

      // A should have a reference to B
      const objB = objA.other!;
      expect(objB).toBeDefined();
      expect(objB.id).toBe('b');
      // B should point back to the very same A instance
      expect(objB.other).toBe(objA);
    });
  });

  describe('invalidate', () => {
    it('causes a new object to be created on the next resolution', async () => {
      const resolver = new Resolver();
      const obj1 = await resolver.resolveOutside('key', simpleRule);

      resolver.invalidate(obj1);

      const obj2 = await resolver.resolveOutside('key', simpleRule, "secondData");

      // Different objects
      expect(obj2).toBe(obj1);
      // Still receives fresh data
      expect(obj1.data).toBe('secondData');
    });
  });
});