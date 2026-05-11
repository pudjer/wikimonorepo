# TODO (frontend)
Нужно реализовать компоненты и страницы
Зафиксировать правило: использовать только export const Component =
Зафиксировать правило: использовать MaterialUI
Зафиксировать правило: если в компонент передается id - значить нужно делать rule.useResolve а не передавать объект в props
Зафиксировать правило: абсолютно все компоненты оборачиваются в f.observer из frontend\src\lib\index.ts
Зафиксировать правило: **store** — только чтение/представление (GET через rule.useResolve).
Зафиксировать правило: **api/mutationApi.ts** используется только для **изменений** (POST/PATCH/DELETE).
Зафиксировать правило: приватный component => mutation api.ts => rule.refresh нужных store rules.
Зафиксировать правило: не нужно проверять линтинг, компиляцию тайпскрипт, и не нужно писать импорты, я все это сделаю сам
Зафиксировать правило: вся информация о текущем пользователе получается из RootRule.useResolve frontend\src\store\stores\Root.ts
Не нужно реализовывать визуализацию графа, просто сделай компонент пустышку для будующей реализации

layout:
  header:
    signedIn ? learningDagPageLink : trendingPageLink
    searchComponent
    signedIn ? profileMini : loginModalButton
pages:
  public:
    authorPage(id):
      username, isMy && edit
      isMy && passwordEdit
      changed && submitButton
      authorArticlesComponent(author.id)
      isMe && myInteractionCollectionComponent
    articlePage(id):
      articleTitleComponent(article, isMy, onChange)
      articleContentComponent(aritcle, isMy, onChange)
      articleLinksComponent(article, isMy, onChange)
      authorComponent(aritcle.authorId)
      articlesDagComponent([article.id])
      isMy && deleteArticleModalWithNameType(article.id)
      isMy && changed && submitButton
    trendingPage:
      searchComponent
      inOrderComponent
  private:
    learningDagPage:
      each node of dag is:
        statComponent(stat):
          isMastered - green
          isLearning - blue
          isTransitiveMastered - lightgreen
          isTransitiveLearning - lightblue
          getTransitiveScore
        preview: previewComponent(value.articleId)
        interaction: interactionComponent(value.articleId)
      previewComponent(ids sorted by getTransitiveScore)
    createArticlePage:
      articleTitleComponent(article, true, onChange)
      articleContentComponent(article, true, onChange)
      articleLinksComponent(article, true, onChange)
      submitButton
components:
  public:
    searchComponent(onSelect):
      input/filters/button
      previewListComponent(ids, onSelect)
    inOrderComponent:
      orderProp/order/button
      previewListComponent(ids)
    authorComponent(id):
      username
    authorArticlesComponent(id):
      previewListComponent(ids)
    articleTitle/Content(article, isEditable?, onEdit?)
    articleLinksComponent(article, isEditable?, onEdit?):
      searchComponent
    articlesDagComponent(ids):
      building and representation of dag
    previewListComponent(ids, onSelect?):
      previewComponent(id, onSelect)
    previewComponent(id, onSelect = navigate(article full page)):
      title,
      onhoverComponent:
        authorComponent(article.authorId)
        auth && interactionComponent(id)
   private:
    interactionComponent(id):
      like/dislike
      remove view if viewed
      learningStageSelector
    myInteractionsComponent:
      likes: previewListComponent(ints.filter)
      views: prev...
      learning: prev...


Фаза 1: Фундамент (базовые компоненты без зависимостей)

interactionComponent — как ты и указал

previewComponent — карточка предпросмотра статьи

authorComponent — отображение автора

previewListComponent — список превьюшек

Фаза 2: Компоненты статей
articleTitleComponent — заголовок с возможностью редактирования

articleContentComponent — контент с возможностью редактирования

articleLinksComponent — связи статьи с поиском

searchComponent — поиск с фильтрами

articlesDagComponent — пустышка для графа

Фаза 3: Специализированные компоненты
authorArticlesComponent — статьи автора

myInteractionsComponent — мои взаимодействия

inOrderComponent — сортировка

Фаза 4: Страницы
trendingPage — публичная главная

authorPage — страница автора

articlePage — страница статьи

createArticlePage — создание статьи

learningDagPage — приватный граф обучения

Фаза 5: Layout
header — шапка со всей логикой

root layout — композиция всего






///добавить learnProgressStage selector
