# TODO (frontend)

## 0. Ввести контракт слоёв (GET/представление vs mutation)
- [ ] Зафиксировать правило: **store/stores** — только чтение/представление (GET через rule.useResolve).
- [ ] Зафиксировать правило: **api.ts** используется только для **изменений** (POST/PATCH/DELETE).
- [ ] Прописать паттерн: приватный component => mutation api.ts => rule.refresh нужных store rules.



layout:
  header:
    signedIn ? learningDagPageLink : trendingPageLink
    searchComponent+
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
      articleInfoComponent(article)
      articleContentComponent(aritcle)
      articleLinksComponent(article)
      authorComponent(aritcle.authorId)
      articlesDagComponent([article.id])
      isMy && deleteArticleModalWithNameType(article.id)
      isMy && changed && submitButton
    trendingPage:
      searchComponent
      inOrderComponent
  private:
    learningDagPage:
      learningDag
components:
  public:
    searchComponent:
      input/filters/button
      previewListComponent(...ids)
    inOrderComponent:
      orderProp/order/button
      previewListComponent(...ids)
    authorComponent(id):
      username
    authorArticlesComponent(id):
      previewListComponent(...ids)
    articleInfo/Content/Links: editable if my
    articlesDagComponent(ids):
      building and representation of dag
    previewListComponent(ids):
      previewComponent(id)
    previewComponent(id):
      title,
      onhover:
        authorComponent(article.authorId)
        auth && interactionComponent(id)
   private:
    interactionComponent(id):
      like/dislike
      remove view if viewed
      learningStageSelector
    myInteractionCollectionComponent:
      likes: previewListComponent(ints.filter)
      views: prev...
      learning: prev...

