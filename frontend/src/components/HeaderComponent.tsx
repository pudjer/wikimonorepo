import { Box, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTranslation } from "react-i18next";
import { f } from "../lib";
import { useThemeMode } from "../context/ThemeContext";
import { RootRule, TotalInteraction, MyLearningStatsRule } from "../store";
import { SearchComponent } from "./SearchComponent";
import { LoginComponent } from "./LoginComponent";
import { mutationApi } from "../api/mutationApi";
import { queryApi } from "../api/queryApi";
import { VisualizeDag } from "./index";
import { StatComponent } from "./StatComponent";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const HeaderComponentBase = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { mode, toggleColorMode } = useThemeMode();
  const { data: root, error, isPending } = RootRule.useResolve(true);
  const { data: learningStats, isPending: isStatsPending, error: statsError } = MyLearningStatsRule.useResolve(root?.myId);

  if (error) {
    console.error("Failed to load user data:", error);
  }

  const isSignedIn = !!root?.myId;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [findUserOpen, setFindUserOpen] = useState(false);
  const [findUsername, setFindUsername] = useState("");
  const [findError, setFindError] = useState<string | null>(null);
  const [findPending, setFindPending] = useState(false);
  const [learningDagOpen, setLearningDagOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);


  const isAdmin = !!root?.isAdmin

  const handleRefresh = async () => {
    if (root?.myId) {
      await MyLearningStatsRule.refresh(root.myId);
    }
  };

  const language = i18n.language === "en" ? "en" : "ru"


  const NodeComponent = useMemo(
    () => ({ node }: { node: TotalInteraction }) => <StatComponent stat={learningStats!.getStats(node)} onSelect={(id)=>{setLearningDagOpen(false); navigate(`/article/${id}`)}} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [learningStats, learningStats?.dag.nodes]
  );

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLogoutPending(true);
    try {
      await mutationApi.private.session.logout();
      await RootRule.refresh(true);
      handleProfileMenuClose();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      setLogoutPending(false);
    }
  };

  const handleFindUser = async () => {
    if (!findUsername.trim()) {
      return;
    }

    setFindPending(true);
    setFindError(null);

    try {
      const user = await queryApi.public.user.getByUsername(findUsername.trim());
      setFindUserOpen(false);
      setFindUsername("");
      navigate(`/author/${user.id}`);
      handleProfileMenuClose();
    } catch (error) {
      console.error("Failed to find user:", error);
      setFindError("Пользователь не найден");
    } finally {
      setFindPending(false);
    }
  };

  const handleToggleColorMode = async () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    toggleColorMode();
    localStorage.setItem("wikimonorepo-ui-theme", nextMode);
    if (root) {
      await RootRule.refresh(true);
    }
  };

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = async (selectedLanguage: "ru" | "en") => {
    handleLanguageMenuClose();
    localStorage.setItem("wikimonorepo-ui-language", selectedLanguage);
    await i18n.changeLanguage(selectedLanguage);
    if (root) {
      await RootRule.refresh(true);
    }
  };

  const handleSearchSelect = (id: string) => {
    navigate(`/article/${id}`);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "background.paper", borderBottom: "1px solid", borderColor: "divider", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", gap: 2, justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <Button
            color="inherit"
            sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold" }}
            onClick={() => navigate("/trending")}
          >
            {t("header.trending")}
          </Button>
          {isSignedIn && (
            <Button
              color="inherit"
              sx={{ textTransform: "none", fontSize: "1rem", fontWeight: "bold" }}
              onClick={() => navigate("/create-article")}
            >
              {t("header.createArticle")}
            </Button>
          )}
        </Box>
        <Button
          color="primary"
          variant="contained"
          sx={{ textTransform: "none", fontSize: 33, fontWeight: "bold", borderRadius: 4, margin: 1 }}
          onClick={() => {
            if (isSignedIn) {
              setLearningDagOpen(true);
            } else {
              setLoginOpen(true);
            }
          }}
        >
          {t("header.learningDag")}
          <AccountTreeIcon sx={{width: 40, height: 40, stroke: "gold"}}/>
        </Button>
        <Box sx={{ flex: 1, maxWidth: 420, minWidth: 200, width: "100%" }}>
          <SearchComponent placeholder={t("header.searchPlaceholder")} onSelect={handleSearchSelect} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button color="inherit" sx={{ textTransform: "none", minWidth: 48 }} onClick={handleLanguageMenuOpen}>
            {language.toUpperCase()}
          </Button>
          <Menu anchorEl={languageAnchorEl} open={Boolean(languageAnchorEl)} onClose={handleLanguageMenuClose}>
            <MenuItem selected={language === "ru"} onClick={() => handleLanguageChange("ru")}>
              {t("header.languageRu")}
            </MenuItem>
            <MenuItem selected={language === "en"} onClick={() => handleLanguageChange("en")}>
              {t("header.languageEn")}
            </MenuItem>
          </Menu>

          <IconButton color="inherit" onClick={handleToggleColorMode} size="large">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : error ? (
            <Button color="inherit" disabled>
              {t("common.errorLoadingUser")}
            </Button>
          ) : isSignedIn ? (
            <>
              <IconButton color="inherit" onClick={handleProfileMenuOpen} size="large">
                <AccountCircleIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
                <MenuItem onClick={() => navigate(`/author/${root?.myId}`)}>{t("header.profile")}</MenuItem>
                {isAdmin && <MenuItem onClick={() => { handleProfileMenuClose(); setFindUserOpen(true); }}>Найти пользователя</MenuItem>}
                <MenuItem onClick={handleLogout} disabled={logoutPending}>
                  {logoutPending ? t("header.loggingOut") : t("header.logout")}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => setLoginOpen(true)}>
              {t("header.login")}
            </Button>
          )}
        </Box>
      </Toolbar>

      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} maxWidth="xs" fullWidth>
            <LoginComponent onCancel={() => setLoginOpen(false)} onSuccess={() => setLoginOpen(false)}/>
      </Dialog>

      <Dialog open={findUserOpen} onClose={() => { setFindUserOpen(false); setFindUsername(""); setFindError(null); }} maxWidth="xs" fullWidth>
        <DialogTitle>Найти пользователя</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            autoFocus
            label="Имя пользователя"
            value={findUsername}
            onChange={(e) => setFindUsername(e.target.value)}
            fullWidth
            disabled={findPending}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleFindUser();
              }
            }}
          />
          {findError && <Box color="error.main">{findError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFindUserOpen(false);
              setFindUsername("");
              setFindError(null);
            }}
            color="primary"
          >
            Отмена
          </Button>
          <Button onClick={handleFindUser} disabled={findPending || !findUsername.trim()} variant="contained" color="primary">
            {findPending ? <CircularProgress size={20} color="inherit" /> : "Найти"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={learningDagOpen} sx={learningDagOpen ? {}: {display: "none"}} keepMounted onClose={() => setLearningDagOpen(false)} maxWidth="xl" fullWidth slotProps={{ paper: { sx: { minHeight: "80vh" } } }}>
        <DialogTitle>{t("learningDag.title")}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {isStatsPending ? (
            <CircularProgress />
          ) : statsError ? (
            <Box color="error.main">{t("learningDag.failedLoad")}</Box>
          ) : learningStats ? (
            <>
              <Box sx={{ height: "100vh", width: "100%" }}>
                <VisualizeDag NodeComponent={NodeComponent} dag={learningStats.dag} getKey={(node) => node.articleId} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Box component="strong">{t("learningDag.pathTitle")}</Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", mt: 1, overflowX: "auto"}}>
                  {learningStats
                    .getAllStats()
                    .filter((stat) => !stat.isTransitiveMastered())
                    .toSorted((a, b) => b.getTransitiveScore() - a.getTransitiveScore())
                    .map((stat) => (
                      <StatComponent key={stat.value.articleId} stat={stat} />
                    ))}
                </Box>
              </Box>
            </>
          ) : (
            <Box>{t("learningDag.noStats")}</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRefresh} variant="contained" color="primary">
            {t("learningDag.refresh")}
          </Button>
          <Button onClick={() => setLearningDagOpen(false)} color="primary">
            {t("learningDag.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export const HeaderComponent = f.observer(HeaderComponentBase);
