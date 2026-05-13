import { Box, Container, TextField, Button, Alert, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { f } from "../../lib";
import { ArticlesDagComponent, AuthorArticlesComponent, MyInteractionsComponent } from "../../components";
import { AuthorRule } from "../../store/stores/public/Author";
import { RootRule } from "../../store";
import { mutationApi } from "../../api/mutationApi";
import { RoleName } from "backend/src/domain/user/roles";

export const AuthorPage = f.observer(() => {
  const { id } = useParams<{ id: string }>();
  const [usernameEdit, setUsernameEdit] = useState("");
  const [passwordEdit, setPasswordEdit] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [role, setRole] = useState<RoleName>(RoleName.Base);
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
  const isAdmin = !!rootData?.isAdmin
  const editable = isMe || isAdmin;
  const handleUsernameSubmit = async () => {
    try {
      setIsSaving(true);
      if(isAdmin){
        await mutationApi.private.admin.user.update(id, {username: usernameEdit})
      }else{
        await mutationApi.private.user.update({ username: usernameEdit });
      }
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
      if(isAdmin){
        await mutationApi.private.admin.user.update(id, {password: newPassword})
      }else{
        await mutationApi.private.user.update({ password: newPassword });
      }
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

  const handleRoleSubmit = async () => {
    try {
      setIsSaving(true);
      await mutationApi.private.admin.user.update(id, {role: role})
      await RootRule.refresh(true);
    } catch (error) {
      console.error("Failed to update Role:", error);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
        <Typography variant="h1">
          {author.username}
        </Typography>

        {editable && (
          <>
            {isAdmin && (
              <Box sx={{ mb: 3 }}>
                <Typography >Is Admin</Typography>
                <TextField
                  sx={{width: 40, height: 40}}
                  value={role === RoleName.Admin ? true : false}
                  onChange={(e) => setRole(e.target.value ? RoleName.Admin : RoleName.Base)}
                  variant="outlined"
                  type="checkbox"
                />
                <Button
                  variant="contained"
                  onClick={handleRoleSubmit}
                  disabled={isSaving}
                >
                  Update Role
                </Button>
              </Box>
            )}
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
        <AuthorArticlesComponent authorId={id} />
      </Box>

      {isMe && (
        <Box>
          <MyInteractionsComponent />
        </Box>
      )}
    </Container>
  );
});
