import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Box, TextField, Button, Paper, Divider, List, ListItem, ListItemText } from "@mui/material";
import { PageSpinner } from "../components/common/PageSpinner";
import { PageTitle } from "../components/common/PageTitle";
import { ArticleList } from "../components/search/ArticleList";
import { LearningDagStats } from "../components/learning/LearningDagStats";
import { useStores } from "../hooks/useStores";
import { StatsBuilder } from "../domain/learningDAG/statsDag";
import { Link, UniqueLinkCollection } from "backend/src/domain/common/entity";
import type { LearnProgressDto } from "../api";

export const ProfilePage = observer(function ProfilePage() {
  const { authStore, articleStore, userStore, interactionStore, dagStore } = useStores();
  const navigate = useNavigate();
  const params = useParams<{ userId?: string }>();
  const isOwnProfile = !params.userId || params.userId === authStore.user?.id;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const profileUser = isOwnProfile ? authStore.user : userStore.users.get(params.userId!);

  useEffect(() => {
    if (!isOwnProfile && params.userId) {
      userStore.fetchPublicUser(params.userId);
    }
  }, [params.userId]);

  useEffect(() => {
    const userId = profileUser?.id;
    if (userId) {
      articleStore.fetchByAuthorId(userId);
    }
  }, [profileUser?.id]);

  useEffect(() => {
    if (isOwnProfile) {
      interactionStore.fetchLikes();
      interactionStore.fetchViews();
      interactionStore.fetchLearnProgress();
    }
  }, [isOwnProfile]);

  useEffect(() => {
    if (authStore.user) {
      setUsername(authStore.user.username);
    }
  }, [authStore.user?.username]);

  useEffect(() => {
    if (isOwnProfile && interactionStore.learnProgress.length > 0) {
      const articleIds = interactionStore.learnProgress.map((lp) => lp.articleId);
      dagStore.fetchDag(articleIds);
    }
  }, [isOwnProfile, interactionStore.learnProgress]);

  const statsBuilder = useMemo<StatsBuilder<LearnProgressDto>>(() => {
    if (!dagStore.dag || interactionStore.learnProgress.length === 0) return null;

    const progressMap = new Map<string, LearnProgressDto>();
    for (const lp of interactionStore.learnProgress) {
      progressMap.set(lp.articleId, lp);
    }

    const nodes = new Set<LearnProgressDto>(interactionStore.learnProgress);

    const rawLinks = dagStore.dag.links
      .map((link) => {
        const child = progressMap.get(link.child);
        const parent = progressMap.get(link.parent);
        return new Link<LearnProgressDto, string, LearnProgressDto>(child, link.name, parent);
      })

    const links = new UniqueLinkCollection(rawLinks);

    const builder = new StatsBuilder(nodes, links);
    return builder;
  }, [dagStore.dag, interactionStore.learnProgress]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const dto: { username?: string; password?: string } = {};
    if (username !== authStore.user?.username) dto.username = username;
    if (password) dto.password = password;
    if (dto.username || dto.password) {
      await authStore.updateProfile(dto);
      setPassword("");
    }
  };

  if (!profileUser) {
    return <PageSpinner />;
  }

  return (
    <Box>
      <PageTitle>{isOwnProfile ? "My Profile" : `User: ${profileUser.username}`}</PageTitle>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        ID: {profileUser.id}
      </Typography>

      {isOwnProfile && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Update Profile
          </Typography>
          <Box component="form" onSubmit={handleUpdate} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Username" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Leave blank to keep current password"
            />
            <Button type="submit" variant="contained" disabled={authStore.isLoading}>
              Update
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => authStore.logout()}>
              Logout
            </Button>
            <Button variant="outlined" color="error" onClick={() => authStore.logoutAll()}>
              Logout All
            </Button>
          </Box>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        Articles
      </Typography>
      <ArticleList articleIds={articleStore.authorArticleIds} />

      {isOwnProfile && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Liked Articles
          </Typography>
          <ArticleList
            articleIds={interactionStore.likes.map((l) => l.articleId)}
            emptyMessage="No liked articles yet."
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Viewed Articles
          </Typography>
          <ArticleList
            articleIds={interactionStore.views.map((v) => v.articleId)}
            emptyMessage="No viewed articles yet."
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Learning Progress
          </Typography>
          {interactionStore.learnProgress.length === 0 ? (
            <Typography color="text.secondary">No learning progress yet.</Typography>
          ) : (
            <List>
              {interactionStore.learnProgress.map((lp) => (
                <ListItem
                  key={lp.articleId}
                  onClick={() => navigate(`/article/${lp.articleId}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemText
                    primary={lp.articleId}
                    secondary={`Stage: ${lp.learnProgressStage}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          {statsBuilder && (
            <LearningDagStats statsBuilder={statsBuilder}/>
          )}
        </>
      )}
    </Box>
  );
});

