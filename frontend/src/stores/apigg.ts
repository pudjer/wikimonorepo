import api from "../api";
import { Autorun } from "../lib/observableProxy/autorun/autorun";
import { HydratorImpl } from "../lib/Singleton/Hydrator";
import { ResolverFn, Resolver, AllocateChild } from "../lib/Singleton/Resolver";
import { RuleBuilder } from "../lib/Singleton/RuleBuilder";
import { IdentityStoreImpl } from "../lib/Singleton/Singleton";

export class StringValue {
  value: string;
}

export class ArticleLink {
  name: StringValue;
  parent: StringValue;
}

export class Author {
  id: string;
  username: StringValue;
}

export class Article {
  id: string;
  title: StringValue;
  content: StringValue;
  author: Author;
  links: ArticleLink[];
}

export class ArticleStatisticResultDTO {
  article: Article;
  views: number;
  likes: number;
  learners: number;
  masters: number;
  dagPoints: number;
}


const autorun = new Autorun()
const builder = new RuleBuilder<object>(c => autorun.registerObject(Object.create(c.prototype)));


const UUIDPattern = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const IndexPattern = "[0-9]+";
const UserPattern = "user";
const ArticlePattern = "article";



builder.buildRuleSimple(
  [ArticlePattern, UUIDPattern],
  Article,
  async (article, key, resolve: ResolverFn<Author>, allocProperty: AllocateChild<StringValue & ArticleLink & []>) => {
    const segments = key.split('/');
    const articleId = segments[1];
    const data = await api.publicArticles.getById(articleId);

    article.id = data.id;

    article.title = await allocProperty(`${key}/title`);
    article.title.value = data.title;

    article.content = await allocProperty(`${key}/content`);
    article.content.value = data.content;

    article.author = await resolve(`${UserPattern}/${data.authorId}`);

    article.links = await allocProperty(`${key}/links`);
    article.links.length = 0;

    for (let i = 0; i < data.links.length; i++) {
      const linkDto = data.links[i];
      const linkKey = `${key}/links/${i}`;

      const link = await allocProperty(linkKey);

      link.name = await allocProperty(`${linkKey}/name`);
      link.name.value = linkDto.name;
      link.parent = await allocProperty(`${linkKey}/parent`);
      link.parent.value = linkDto.parent;

      article.links.push(link);
    }
  }
);

builder.delegatingRuleSimple(
  [ArticlePattern, UUIDPattern, "title"],
  StringValue,
);
builder.delegatingRuleSimple(
  [ArticlePattern, UUIDPattern, "content"],
  StringValue,
);
builder.delegatingRuleSimple(
  [ArticlePattern, UUIDPattern, "links"],
  Array,
);
builder.delegatingRuleSimple(
  [ArticlePattern, UUIDPattern, "links", IndexPattern],
  ArticleLink,
);
builder.delegatingRuleSimple(
  [ArticlePattern, UUIDPattern, "links", IndexPattern, "name"],
  StringValue,
);
builder.delegatingRuleSimple(
  [ArticlePattern, UUIDPattern, "links", IndexPattern, "parent"],
  StringValue,
);

builder.buildRuleSimple(
  [UserPattern, UUIDPattern],
  Author,
  async (author, key, resolve, allocProperty: AllocateChild<StringValue>) => {
    const segments = key.split('/');
    const userId = segments[1];
    const data = await api.publicUser.get(userId);

    author.id = data.id;

    author.username = await allocProperty(`${key}/username`);
    author.username.value = data.username;
  }
);

builder.delegatingRuleSimple(
  [UserPattern, UUIDPattern, "username"],
  StringValue,
);

const resolver = new Resolver(new IdentityStoreImpl(), new HydratorImpl());
builder.rules.forEach((rule) => resolver.addRule(rule));

export { resolver };

(async () => {
  const articleLink = await resolver.resolveOutside<ArticleLink>(
    "article/357c25ed-5e75-4245-9e20-a87d14129f00/links/0"
  );
  console.log(articleLink);

  autorun.autorun(() => {
    console.log("value:", articleLink.name.value);
  });

  articleLink.name.value = "Новое имя ссылки";
})();