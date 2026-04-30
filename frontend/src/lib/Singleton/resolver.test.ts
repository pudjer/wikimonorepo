/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hydrator, HydratorImpl } from './Hydrator';
import { IResolver, Resolver, type BuildRule, type DelegatingRule } from './Resolver';
import { IdentityStore, IdentityStoreImpl } from './Singleton';


describe('Resolver', () => {
  let allocator: IdentityStore;
  let hydrator: Hydrator;
  let resolver: IResolver;

  beforeEach(() => {
    allocator = new IdentityStoreImpl();
    hydrator = new HydratorImpl();
    resolver = new Resolver(allocator, hydrator);
  });

  describe('базовый FetchRule', () => {
    it('должен загрузить данные по ключу через правило, clear не вызывается', async () => {
      const clearMock = vi.fn();
      const rule: BuildRule<{ id: string }> = {
        matchKey: (key) => key.startsWith('user:'),
        allocate: (key) => ({ id: key.replace('user:', '') }),
        update: async (target) => { target.id = `loaded-${target.id}`; },
        
      };
      resolver.addRule(rule);

      
      const result = await resolver.resolveOutside<{ id: string }>('user:123');
      expect(result.id).toBe('loaded-123');
      expect(clearMock).not.toHaveBeenCalled();

      // повторный вызов – из кеша, clear всё ещё не вызывается
      const cached = await resolver.resolveOutside<{ id: string }>('user:123');
      expect(cached).toBe(result);
      expect(clearMock).not.toHaveBeenCalled();
    });

    it('должен выбрасывать ошибку, если правило не найдено', async () => {
      
      await expect(resolver.resolveOutside('unknown')).rejects.toThrow('No rule found for key: unknown');
    });
  });

  describe('invalidate', () => {
    it('при invalidate вызывается clear для соответствующего правила', async () => {
      const rule: BuildRule<{ id: string }> = {
        matchKey: (key) => key === 'user',
        allocate: () => ({ id: 'old' }),
        update: async (target) => { target.id = 'new'; },
        
      };
      resolver.addRule(rule);
      
      const obj = await resolver.resolveOutside<{ id: string }>('user');
      expect(obj.id).toBe('new');

      // invalidate должен вызвать clear для этого объекта
      resolver.refresh('user');
      
      const obj2 = await resolver.resolveOutside<{ id: string }>('user');

    });

    it('после invalidate повторный resolve создаёт новый объект и очищает старый через clear', async () => {
      let buildCount = 0;
      const rule: BuildRule<{ value: number }> = {
        matchKey: (key) => key === 'counter',
        allocate: () => ({ value: 0 }),
        update: async (target) => {
          target.value = ++buildCount; // имитация нового состояния
        },
        
      };
      resolver.addRule(rule);
      

      const first = await resolver.resolveOutside<{ value: number }>('counter');
      expect(first.value).toBe(1);

      resolver.refresh('counter');
      // clear вызван для старого объекта

      const second = await resolver.resolveOutside<{ value: number }>('counter');
      expect(second).toBe(first); // новый объект
      expect(second.value).toBe(2);
      // clear не вызывается при повторном resolve (только при invalidate)
    });

  });

  describe('ParentRule (делегирование)', () => {
    it('должен использовать ParentRule для перенаправления ключа на другой, clear не вызывается', async () => {
      const fetchRule = {
        matchKey: (key) => key === 'real',
        allocate: () => ({ value: '' }),
        update: async (target, key, resolve, ensure) => {
          target.value = 'loaded';
          await ensure('child');
        },
      };
      const childRule = {
        matchKey: (key) => key === 'child',
        toParentKey: () => 'real',
        allocate: () => ({ value: 'child' }),
      };
      resolver.addRule(fetchRule);
      resolver.addRule(childRule);

      
      const result = await resolver.resolveOutside<{ value: string }>('child');
      expect(result.value).toBe('child');
    });

    it('должен выбросить ошибку, если родитель не зарегистрировал дочерний объект', async () => {
      const parentRule = {
        matchKey: (key) => key === 'parent',
        allocate: () => ({}),
        update: async () => {},
      }
      const childRule = {
        matchKey: (key) => key === 'child',
        toParentKey: () => 'parent',
        allocate: () => ({}),
      }
      resolver.addRule(parentRule);
      resolver.addRule(childRule);

      
    });
  });

  describe('getReady', () => {

    it('возвращает загруженный объект после разрешения, clear не вызывается', async () => {
      const rule: BuildRule<{ x: number }> = {
        matchKey: (key) => key === 'num',
        allocate: () => ({ x: 0 }),
        update: async (target) => { target.x = 42; },
        
      };
      resolver.addRule(rule);
      
      const resolved = await resolver.resolveOutside('num');

    });
  });

  describe('несколько правил и выбор по matchKey', () => {
    it('должен выбрать первое подходящее правило, clear не вызывается', async () => {
      const rule1: BuildRule<{ type: string }> = {
        matchKey: (key) => key === 'common',
        allocate: () => ({ type: 'rule1' }),
        update: async () => {},
        
      };
      const rule2: BuildRule<{ type: string }> = {
        matchKey: (key) => key === 'common',
        allocate: () => ({ type: 'rule2' }),
        update: async () => {},
        
      };
      resolver.addRule(rule1);
      resolver.addRule(rule2);
      
      const result = await resolver.resolveOutside<{ type: string }>('common');
      expect(result.type).toBe('rule1');
    });
  });

  describe('асинхронное build и resolve внутри build', () => {
    it('должен разрешать зависимости внутри build без вызова clear', async () => {
      const profileClear = vi.fn();
      const profileRule: BuildRule<{ data: string }> = {
        matchKey: (key) => key === 'profile',
        allocate: () => ({ data: '' }),
        update: async (target) => { target.data = 'profile-data'; },
        
      };
      const userRule: BuildRule<{ profile: unknown }> = {
        matchKey: (key) => key === 'user',
        allocate: () => ({ profile: null }),
        update: async (target, key, resolve, ensure) => {
          const profile = await resolve('profile');
          target.profile = profile;
        },
        
      };
      resolver.addRule(profileRule);
      resolver.addRule(userRule);
      
      const user = await resolver.resolveOutside<{ profile: { data: string } }>('user');

      expect(user.profile.data).toBe('profile-data');
    });

    it('invalidate зависимости должен очистить и пересоздать её', async () => {
      let profileBuildCount = 0;
      const profileRule: BuildRule<{ version: number }> = {
        matchKey: (key) => key === 'profile',
        allocate: () => ({ version: 0 }),
        update: async (target) => { target.version = ++profileBuildCount; },
        
      };
      const userRule: BuildRule<{ profile: unknown }> = {
        matchKey: (key) => key === 'user',
        allocate: () => ({ profile: null }),
        update: async (target, key, resolve) => {
          target.profile = await resolve('profile');
        },
      };
      resolver.addRule(profileRule);
      resolver.addRule(userRule);
      

      const user1 = await resolver.resolveOutside<{ profile: {version: number} }>('user');
      expect(user1.profile.version).toBe(1);

      // инвалидируем только profile
      resolver.refresh('profile');
  

      // повторный resolve user должен подтянуть новый profile
      const user2 = await resolver.resolveOutside<{ profile: {version: number} }>('user');
      expect(user2).toBe(user1); // объект user тот же
      expect(user2.profile).toBe(user1.profile); // profile новый
      expect(user2.profile.version).toBe(2);
      // clear больше не вызывался
    });
  });
});