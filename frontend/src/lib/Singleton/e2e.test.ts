import { describe, it, expect, vi, beforeEach } from "vitest";

import { HydratorImpl } from "./Hydrator";
import { AllocateChild, Resolver, ResolverFn } from "./Resolver";
import { RuleBuilder } from "./RuleBuilder";
import { IdentityStoreImpl } from "./Singleton";

/**
 * ===== API TYPES =====
 */
type ApiUser = {
  id: number;
  username: string;
  company?: {
    catchPhrase?: string;
  };
};

/**
 * ===== DOMAIN =====
 */
class User {
  constructor(
    public id: string,
    public username: UserName,
    public profile: Profile
  ) {}
}

class UserName {
  constructor(public value: string) {}
}

class Profile {
  constructor(
    public bio: Bio,
    public user: User
  ) {}
}

class Bio {
  constructor(public value: string) {}
}

/**
 * ===== MOCK FETCH =====
 */
const mockApiUser: ApiUser = {
  id: 1,
  username: "Bret",
  company: {
    catchPhrase: "Multi-layered client-server neural-net",
  },
};

beforeEach(() => {
  vi.restoreAllMocks();

  vi.stubGlobal("fetch", vi.fn(async () => ({
    ok: true,
    json: async () => mockApiUser,
  })));
});

/**
 * ===== HELPERS =====
 */
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  return res.json() as Promise<T>;
}

const userCache = new Map<string, ApiUser>();

async function getUser(userId: string): Promise<ApiUser> {
  if (userCache.has(userId)) {
    return userCache.get(userId)!;
  }

  const data = await fetchJson<ApiUser>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  userCache.set(userId, data);
  return data;
}

/**
 * ===== TEST =====
 */
describe("Resolver graph hydration", () => {
  it("должен корректно собрать User с циклической ссылкой", async () => {
    const builder = new RuleBuilder<object>();

    builder.buildRuleSimple(
      "^user:[0-9]+$",
      User,
      async (user, key, resolve: ResolverFn<Profile>, allocProperty: AllocateChild<UserName>) => {
        const userId = key.split(":")[1];
        const data = await getUser(userId);

        user.id = String(data.id);

        user.username = await allocProperty(`${key}.username`);
        user.username.value = data.username;

        user.profile = await resolve(`profile:${userId}`);
      }
    );

    builder.delegatingRuleSimple(
      "^user:[0-9]+\\.username$",
      UserName,
      ".username"
    );

    builder.buildRuleSimple(
      "^profile:[0-9]+$",
      Profile,
      async (profile, key, resolve: ResolverFn<User>, allocProperty: AllocateChild<Bio>) => {
        const userId = key.split(":")[1];
        const data = await getUser(userId);

        profile.bio = await allocProperty(`${key}.bio`);
        profile.bio.value = data.company?.catchPhrase ?? "no bio";

        profile.user = await resolve(`user:${userId}`);
      }
    );

    builder.delegatingRuleSimple(
      "^profile:[0-9]+\\.bio$",
      Bio,
      ".bio"
    );

    const resolver = new Resolver(
      new IdentityStoreImpl(),
      new HydratorImpl()
    );

    builder.rules.forEach(rule => resolver.addRule(rule));

    const user = await resolver.resolveOutside<User>("user:1");

    // ===== ASSERTS =====
    expect(user.id).toBe("1");
    expect(user.username.value).toBe("Bret");
    expect(user.profile.bio.value).toBe(
      "Multi-layered client-server neural-net"
    );

    // ключевая проверка identity map (циклическая ссылка)
    expect(user.profile.user).toBe(user);

    // fetch должен дернуться только 1 раз из-за cache
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});