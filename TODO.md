# Plan: Add getByUserId endpoints to InteractionUserArticleController

1. ✅ Add DTOs for Like, View, and LearnProgress responses in `DTO.ts`
2. ✅ Add GET endpoints in `controller.ts` for:
   - `/likes` -> `likeService.getByUserId(userId)`
   - `/views` -> `viewService.getByUserId(userId)`
   - `/learnProgress` -> `learnProgressService.getByUserId(userId)`
3. ✅ Verify compilation
