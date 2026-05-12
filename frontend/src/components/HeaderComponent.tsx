import { Box, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback, type MouseEvent, type ReactElement } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { autorun, f } from "../lib";
import { useThemeMode } from "../context/ThemeContext";
import { MyLearningDAGRule, RootRule, Interaction } from "../store";
import { SearchComponent } from "./SearchComponent";
import { StatComponent } from "./StatComponent";
import { mutationApi } from "../api/mutationApi";
import { LearningDagDialog, LoginDialog } from "./HeaderDialogs";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { StatsBuilder } from "../domain/learningDAG/statsDag";
import { DAG } from "../domain/DAG/entity";
import { UniqueLinkCollection } from "backend/src/domain/common/entity";

type LanguageMenuProps = {
  language: "ru" | "en";
  anchorEl: HTMLElement | null;
  onOpen: (event: MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onSelect: (language: "ru" | "en") => Promise<void> | void;
  t: ReturnType<typeof useTranslation>[0];
};

const LanguageMenu = ({ language, anchorEl, onOpen, onClose, onSelect, t }: LanguageMenuProps) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <Button color="inherit" sx={{ textTransform: "none", minWidth: 48 }} onClick={onOpen}>
      {language.toUpperCase()}
    </Button>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem selected={language === "ru"} onClick={() => onSelect("ru")}>{t("header.languageRu")}</MenuItem>
      <MenuItem selected={language === "en"} onClick={() => onSelect("en")}>{t("header.languageEn")}</MenuItem>
    </Menu>
  </Box>
);

type ProfileMenuProps = {
  isPending: boolean;
  error: unknown;
  isSignedIn: boolean;
  anchorEl: HTMLElement | null;
  onOpen: (event: MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onProfile: () => void;
  onLogout: () => void;
  logoutPending: boolean;
  onLogin: () => void;
  t: TFunction;
};

const ProfileMenu = ({ isPending, error, isSignedIn, anchorEl, onOpen, onClose, onProfile, onLogout, logoutPending, onLogin, t }: ProfileMenuProps) => {
  if (isPending) {
    return <CircularProgress size={24} color="inherit" />;
  }

  if (error) {
    return (
      <Button color="inherit" disabled>
        {t("common.errorLoadingUser")}
      </Button>
    );
  }

  if (isSignedIn) {
    return (
      <>
        <IconButton color="inherit" onClick={onOpen} size="large">
          <AccountCircleIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
          <MenuItem onClick={onProfile}>{t("header.profile")}</MenuItem>
          <MenuItem onClick={onLogout} disabled={logoutPending}>
            {logoutPending ? t("header.loggingOut") : t("header.logout")}
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Button color="inherit" onClick={onLogin}>
      {t("header.login")}
    </Button>
  );
};

const HeaderComponentBase = () => {
  const { t, i18n } = useTranslation();
  const { mode, toggleColorMode } = useThemeMode();
  const { data: root, error, isPending } = RootRule.useResolve(true);

  if (error) {
    console.error("Failed to load user data:", error);
  }

  const isSignedIn = !!root?.myId;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [learningDagOpen, setLearningDagOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const { data, isPending: isDagPending, error: dagError } = MyLearningDAGRule.useResolve(root?.myId);

  const dag = useMemo(() => data || new DAG<Interaction>(new Set(), new UniqueLinkCollection([])), [data]);
  const learningStats = useMemo(() => new StatsBuilder<Interaction>(dag), [dag]);
  
  
  for (const stat of learningStats.getAllStats()) {
    autorun.autorun(() => stat.init());
  }
  

  
  const language = i18n.language === "en" ? "en" : "ru";
  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
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

  const handleToggleColorMode = async () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    toggleColorMode();
    localStorage.setItem("wikimonorepo-ui-theme", nextMode);
    
    if (root) {
      await RootRule.refresh(true);
    }
  };
  
  const handleLanguageMenuOpen = (event: MouseEvent<HTMLElement>) => {
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

  
  const handleLearningDagClick = () => {
    if (isSignedIn) {
      setLearningDagOpen(true);
    } else {
      setLoginOpen(true);
    }
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
          onClick={handleLearningDagClick}
        >
          {t("header.learningDag")}
          <AccountTreeIcon sx={{ width: 40, height: 40, stroke: "gold" }} />
        </Button>

        <Box sx={{ flex: 1, maxWidth: 420, minWidth: 200, width: "100%" }}>
          <SearchComponent placeholder={t("header.searchPlaceholder")} onSelect={handleSearchSelect} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LanguageMenu
            language={language}
            anchorEl={languageAnchorEl}
            onOpen={handleLanguageMenuOpen}
            onClose={handleLanguageMenuClose}
            onSelect={handleLanguageChange}
            t={t}
          />
          <IconButton color="inherit" onClick={handleToggleColorMode} size="large">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <ProfileMenu
            isPending={isPending}
            error={error}
            isSignedIn={isSignedIn}
            anchorEl={anchorEl}
            onOpen={handleProfileMenuOpen}
            onClose={handleProfileMenuClose}
            onProfile={() => navigate(`/author/${root?.myId}`)}
            onLogout={handleLogout}
            logoutPending={logoutPending}
            onLogin={() => setLoginOpen(true)}
            t={t}
          />
        </Box>
      </Toolbar>

      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => {
          setLoginOpen(false);
          setLearningDagOpen(true);
        }}
      />

      <LearningDagDialog
        open={learningDagOpen}
        onClose={() => setLearningDagOpen(false)}
      />
    </AppBar>
  );
};

export const HeaderComponent = f.observer(HeaderComponentBase);
