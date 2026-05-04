# TODO: Rename articleStatistic to articlePreview + add title, authorId

## Steps:
- [x] 1. Rename backend directories/files: domain/articleStatistic/ -> articlePreview/, presentation/articleStatistic/ -> articlePreview/, implementations/domain/articleStatistic/ -> articlePreview/
- [x] 2. Update backend domain/articlePreview/entity.ts: Rename ArticleStatistic->ArticlePreview, add title: Title, authorId: UserId, rename enums to PreviewOrder/PreviewOrderingProp
- [x] 3. Update presentation/articlePreview/{DTO.ts, mapper.ts, controller.ts}: Add title/authorId fields, update paths/services/tokens
- [x] 4. Update application/articleTotalStatistic/service.ts -> /articlePreview/service.ts: Rename interface/class
- [x] 5. Update domain/articlePreview/repository.ts & impl: Add fields to queries/FindResult
- [ ] 6. Update all refs: modules (domain.module.ts etc.), tokens.ts, infra tasks, api.ts paths
- [ ] 7. Frontend: Rename store/stores/ArticleStatistic.ts -> ArticlePreview.ts, uncomment/activate class, add title/authorId, update patterns/keys/builder rules, update api client paths/imports
- [ ] 8. Verify Neo4j queries (title/authorId on Article nodes), test endpoints/stores
- [ ] 9. Update any other refs from search_files results

Current progress: Starting step 1.
