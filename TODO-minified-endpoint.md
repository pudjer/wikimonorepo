# Add public/articles/minified/:id endpoint

## Steps:
- [x] 1. Edit backend/src/presentation/article/common/DTO.ts - add MinifiedArticleResultDTO
- [x] 2. Edit backend/src/presentation/article/common/mapper.ts - add minifiedMapper
- [x] 3. Edit backend/src/application/article/public/service.ts - extend IArticleServicePublic and implement findMinifiedById
- [x] 4. Edit backend/src/presentation/article/public/controller.ts - add @Get('minified/:id')
- [x] 5. Edit frontend/src/api.ts - add type import and publicArticles.getMinifiedById
- [x] 6. Build backend and test

Progress will be updated after each step.

