import { f } from "../lib";
import { useTranslation } from "react-i18next";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Preview, DAGRule } from "../store";
import { VisualizeDag } from "./GenericDagPresentation";
import { PreviewComponent } from "./PreviewComponent";
import { useCallback } from "react";

type ArticlesDagComponentProps = {
  ids: string[];
};

const ArticlesDagComponentBase = ({ ids }: ArticlesDagComponentProps) => {
  const { t } = useTranslation();
  const { data, isPending, error } = DAGRule.useResolve(ids);
  const getKey = useCallback((node: Preview)=>node.id, [])
  const factory = useCallback((node: Preview)=>()=><PreviewComponent id={node.id} key={node.id}/>, [])
  return <Box sx={{ width: "100%", height: "80vh", overflow: "auto" }}>
      {isPending ? (
        <Box>
          <CircularProgress size={20} />
          <Typography>{t('articlesDag.loading')}</Typography>
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error">
          {t('articlesDag.failedLoad')}
        </Typography>
      ) : data && (
        <VisualizeDag dag={data} ComponentFactory={factory} getKey={getKey} />
      )}
    </Box>
};

export const ArticlesDagComponent = f.observer(ArticlesDagComponentBase);
