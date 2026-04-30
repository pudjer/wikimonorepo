// Доменные модели (все поля обёрнуты)

import api from "../api";
import { HydratorImpl } from "../lib/Singleton/Hydrator";
import { ResolverFn, Resolver, AllocateChild } from "../lib/Singleton/Resolver";
import { RuleBuilder } from "../lib/Singleton/RuleBuilder";
import { IdentityStoreImpl } from "../lib/Singleton/Singleton";

// ------------------------------------------------------------------
// Модели
// ------------------------------------------------------------------
export class Title {
  constructor(public value: string) {}
}

export class Content {
  constructor(public value: string) {}
}

export class Username {
  constructor(public value: string) {}
}

export class ArticleLinkName {
  constructor(public value: string) {}
}

export class ArticleParentRef {
  constructor(public value: string) {}
}

export class ArticleLink {
  name!: ArticleLinkName;
  parent!: ArticleParentRef;
}

export class ArticleLinks extends Array<ArticleLink> {}

export class Author {
  id!: string;
  username!: Username;
}

export class Article {
  id!: string;
  title!: Title;
  content!: Content;
  author!: Author;
  links!: ArticleLinks
}


// Кэши
// ------------------------------------------------------------------
// Построение правил
// ------------------------------------------------------------------
const builder = new RuleBuilder<object>();

// ----- Статья -----------------------------------------------------
builder.buildRuleSimple(
  "^article:[0-9a-f-]+$",
  Article,
  async (article, key, resolve: ResolverFn<Author>, allocProperty: AllocateChild<Title & Content & ArticleLink & ArticleLinks>) => {
    const articleId = key.split(":")[1];
    const data = await api.publicArticles.getById(articleId);

    article.id = data.id;

    // простые обёртки через allocProperty (для единообразия)
    article.title = await allocProperty(`${key}.title`);
    article.title.value = data.title;

    article.content = await allocProperty(`${key}.content`);
    article.content.value = data.content;

    // автор разрешается через Resolver (поддерживает циклические ссылки)
    article.author = await resolve(`user:${data.authorId}`);

    // заполняем массив ссылок
    article.links = await allocProperty(`${key}.links`);
    article.links.length = 0;

    for (let i = 0; i < data.links.length; i++) {
      const linkDto = data.links[i];
      const linkKey = `${key}.links[${i}]`;

      // создаём объект ArticleLink через Resolver
      const link = await allocProperty(linkKey);

      // создаём подобъекты вручную (через new), так как для них нет DTO в контексте
      link.name = await allocProperty(`${linkKey}.name`);
      link.name.value = linkDto.name;
      link.parent = await allocProperty(`${linkKey}.parent`);
      link.parent.value = linkDto.parent;

      article.links.push(link);
    }
  }
);

// делегирующие правила для примитивных полей статьи
builder.delegatingRuleSimple(
  "^article:[0-9a-f-]+\\.title$",
  Title,
  ".title"
);
builder.delegatingRuleSimple(
  "^article:[0-9a-f-]+\\.content$",
  Content,
  ".content"
);
builder.delegatingRuleSimple(
  "^article:[0-9a-f-]+\\.links$",
  ArticleLinks,
  ".links" 
)
// правило для создания пустого ArticleLink (без заполнения полей)
builder.delegatingRuleSimple(
  "^article:[0-9a-f-]+\\.links\\[\\d+\\]$",
  ArticleLink,
  /\[\d+\]$/ // ничего не делаем – поля заполнятся выше
);
builder.delegatingRuleSimple(
  "^article:[0-9a-f-]+\\.links\\[\\d+\\].name$",
  ArticleLinkName,
  ".name"
);
builder.delegatingRuleSimple(
  "^article:[0-9a-f-]+\\.links\\[\\d+\\].parent$",
  ArticleParentRef,
  ".parent"
)
// ----- Пользователь (Author) ------------------------------------
builder.buildRuleSimple(
  "^user:[0-9a-f-]+$",
  Author,
  async (author, key, resolve, allocProperty: AllocateChild<Username>) => {
    const userId = key.split(":")[1];
    const data = await api.publicUser.get(userId);

    author.id = data.id;

    author.username = await allocProperty(`${key}.username`);
    author.username.value = data.username;
  }
);

builder.delegatingRuleSimple(
  "^user:[0-9a-f-]+\\.username$",
  Username,
  ".username"
);

// ------------------------------------------------------------------
// Инициализация Resolver (синглтон)
// ------------------------------------------------------------------
const resolver = new Resolver(new IdentityStoreImpl(), new HydratorImpl());

builder.rules.forEach((rule) => resolver.addRule(rule));

// Экспорт для использования в других модулях
export { resolver };


const article = await resolver.resolveOutside<Article>("article:357c25ed-5e75-4245-9e20-a87d14129f00");
console.log(article.author.username.value);          
console.log(article.links[0].name.value);           
console.log(article.links[0].parent.value);           // parent первой ссылки