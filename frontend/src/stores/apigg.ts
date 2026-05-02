import api from "../api";
import { Autorun } from "../lib/observableProxy/autorun/autorun";
import { getObserverHoc } from "../lib/reactObserver/observer";
import { HydratorImpl } from "../lib/Singleton/Hydrator";
import { Resolver } from "../lib/Singleton/Resolver";
import { RuleBuilder } from "../lib/Singleton/RuleBuilder";
import { IdentityStoreImpl } from "../lib/Singleton/Singleton";

export class StringValue {
  value: string;
}

export class ArticleLink {
  name: string;
  parent: string;
}

export class Author {
  id: string;
  username: string;
}

export class Article {
  id: string;
  title: string;
  content: string;
  author: Author;
  links: ArticleLink[];
  createdAt: Date;
  updatedAt: Date;
}




const autorun = new Autorun()
autorun.autorun((dispose) => {dispose()})()//dispose
const builder = new RuleBuilder<object>(c => autorun.registerObject(Object.create(c.prototype)));


export const UUIDPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
export const UserPattern = "user";
export const ArticlePattern = "article";

export function CompileString(strArr: string[]): string {
  return strArr.join("/");
}



builder.buildRuleSimple(
  CompileString([ArticlePattern, UUIDPattern]),
  Article,
  async (article, key, resolve) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticles.getById(articleId);

    article.id = data.id;
    article.title = data.title;
    article.content = data.content;
    article.links = data.links;
    article.createdAt = new Date(data.createdAt);
    article.updatedAt = new Date(data.updatedAt);

    article.author = await resolve(CompileString([UserPattern, data.authorId]));
  }
);


builder.buildRuleSimple(
  CompileString([UserPattern, UUIDPattern]),
  Author,
  async (author, key) => {
    const segments = key.split('/');
    const userId = segments[1];
    const data = await api.publicUser.get(userId);

    author.id = data.id;

    author.username = data.username;
  }
);


builder.buildRuleSimple(
  CompileString(["me"]),
  Author,
  async (me) => {
    const data = await api.privateUser.get();
    me.id = data.id;
    me.username = data.username;
  }
);


const resolver = new Resolver(new IdentityStoreImpl(), new HydratorImpl());
builder.rules.forEach((rule) => resolver.addRule(rule));

(async () => {
  const art = await resolver.resolveOutside<Article>(CompileString([ArticlePattern, "5e3f9fdd-3728-427e-add8-ecc506eb652a"]));
  console.log(art);
})();



const observer = getObserverHoc(autorun);
export { resolver, autorun, observer };