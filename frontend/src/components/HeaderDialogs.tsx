import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import { LoginComponent } from "./LoginComponent";
import { VisualizeDag } from "./index";
import { StatComponent } from "./StatComponent";
import { t } from "i18next";
import { useCallback } from "react";
import { Interaction, MyLearningDAGRule, RootRule } from "../store";
import { useNavigate } from "react-router-dom";

type LoginDialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export const LoginDialog = ({ open, onClose, onSuccess }: LoginDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <LoginComponent onCancel={onClose} onSuccess={onSuccess} />
  </Dialog>
);

type LearningDagDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const LearningDagDialog = ({
  open,
  onClose,
}: LearningDagDialogProps) => {
  const {data: root} = RootRule.useResolve(true)
  const navigate = useNavigate()
  
  const factory = useCallback(
    (node: Interaction) =>
      () => (
        <StatComponent
        onSelect={(id) => {
            onClose()
            navigate(`article/${id}`);
          }}
          stat={learningStats.getStats(node)}
          />
        ),
    [learningStats, navigate]
  );
  const getKey = useCallback((node: Interaction) => node.articleId, []);
  const onRefresh = async () => {
    if (root?.myId) {
      await MyLearningDAGRule.refresh(root.myId);
    }
  };
  const handleNavigateTrending = () => {
    onClose();
    navigate("/trending");
  };

  return <Dialog open={open} sx={open ? {} : { display: "none" }} keepMounted onClose={onClose} maxWidth="xl" fullWidth slotProps={{ paper: { sx: { minHeight: "80vh" } } }}>
    <DialogTitle>{t("learningDag.title")}</DialogTitle>
    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {isPending ? (
        <CircularProgress />
      ) : error ? (
        <Box color="error.main">{t("learningDag.failedLoad")}</Box>
      ) : learningStats ? (
        <>
          <Box sx={{ height: "100vh", width: "100%" }}>
            {learningStats.getAllStats().length ? (
              <VisualizeDag ComponentFactory={factory} dag={dag} getKey={getKey} />
            ) : (
              <Box>
                <Typography variant="h2">{t("header.emptyDag")}</Typography>
                <Button onClick={onNavigateTrending}>
                  <Typography variant="h2">{t("header.trending")}</Typography>
                </Button>
              </Box>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Box component="strong">{t("learningDag.pathTitle")}</Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap", mt: 1, overflowX: "auto" }}>
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
      <Button onClick={onRefresh} variant="contained" color="primary">
        {t("learningDag.refresh")}
      </Button>
      <Button onClick={onClose} color="primary">
        {t("learningDag.close")}
      </Button>
    </DialogActions>
  </Dialog>
}
