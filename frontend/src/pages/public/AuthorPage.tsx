import { Box, Container, TextField, Button, Alert, Skeleton } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { f } from "../../lib";
import { AuthorArticlesComponent, MyInteractionsComponent } from "../../components";
import { AuthorRule } from "../../store/stores/public/Author";
import { RootRule } from "../../store";
import { mutationApi } from "../../api/mutationApi";

export const AuthorPage = f.observer(() => {
  const { id } = useParams<{ id: string }>();
  const [usernameEdit, setUsernameEdit] = useState("");
  const [passwordEdit, setPasswordEdit] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!id) return <Box>Author not found</Box>;

  const {
    data: author,
    isPending: isAuthorPending,
    error: authorError,
  } = AuthorRule.useResolve(id);
  const {
    data: rootData,
    isPending: isRootPending,
  } = RootRule.useResolve(true);

  const isPending = isAuthorPending || isRootPending;
  const isMe = !!rootData?.myId && rootData.myId === id;

  const handleUsernameSubmit = async () => {
    try {
      setIsSaving(true);
      await mutationApi.private.user.update({ username: usernameEdit });
      await RootRule.refresh(true);
      setUsernameEdit("");
    } catch (error) {
      console.error("Failed to update username:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      setIsSaving(true);
      setPasswordError("");
      if (!passwordEdit || !newPassword) {
        setPasswordError("Please fill in both fields");
        return;
      }
      await mutationApi.private.user.update({ password: newPassword });
      setPasswordEdit("");
      setNewPassword("");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
      </Container>
    );
  }

  if (authorError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{authorError.message || "Failed to load author."}</Alert>
      </Container>
    );
  }

  if (!author) return <Box>Author not found</Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
        <Box sx={{ fontSize: "1.5rem", fontWeight: "bold", mb: 2 }}>
          {author.username}
        </Box>

        {isMe && (
          <>
            <Box sx={{ mb: 3 }}>
              <TextField
                label="New Username"
                value={usernameEdit}
                onChange={(e) => setUsernameEdit(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleUsernameSubmit}
                disabled={isSaving || !usernameEdit}
              >
                Update Username
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ mb: 1 }}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={passwordEdit}
                  onChange={(e) => setPasswordEdit(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Box>
              {passwordError && <Alert severity="error">{passwordError}</Alert>}
              <Button
                variant="contained"
                onClick={handlePasswordSubmit}
                disabled={isSaving || !passwordEdit || !newPassword}
              >
                Update Password
              </Button>
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>
          Articles
        </Box>
        <AuthorArticlesComponent authorId={id} />
      </Box>

      {isMe && (
        <Box>
          <Box sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 2 }}>
            My Interactions
          </Box>
          <MyInteractionsComponent />
        </Box>
      )}
    </Container>
  );
});
