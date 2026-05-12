import { f } from "../lib";
import { useTranslation } from "react-i18next";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DAGRule } from "../store";
import { VisualizeDag } from "./GenericDagPresentation";
import { PreviewComponent } from "./PreviewComponent";

type ArticlesDagComponentProps = {
  ids: string[];
};

const ArticlesDagComponentBase = ({ ids }: ArticlesDagComponentProps) => {
  const { t } = useTranslation();
  const { data, isPending, error } = DAGRule.useResolve(ids);

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
        <VisualizeDag dag={data} NodeComponent={({node}) => <PreviewComponent id={node.id}/>} getKey={node=>node.id} />
      )}
    </Box>
};

export const ArticlesDagComponent = f.observer(ArticlesDagComponentBase);
