import { f } from "../lib";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { SearchComponent } from "./SearchComponent";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PreviewComponent } from "./PreviewComponent";
import { ArticlePreviewCollectionRule } from "../store";

type ArticleLinkInfo = {
  parentId: string;
  name: string;
};

type ArticleLinksComponentProps = {
  links: ArticleLinkInfo[];
  isEditable?: boolean;
  onAddLink?: (parentId: string) => void;
  onRemoveLink?: (parentId: string) => void;
  onLinkNameChange?: (parentId: string, name: string) => void;
};

const ArticleLinksComponentBase = ({
  links,
  isEditable,
  onAddLink,
  onRemoveLink,
  onLinkNameChange,
}: ArticleLinksComponentProps) => {
  const { t } = useTranslation();
  const { data, isPending, error } = ArticlePreviewCollectionRule.useResolve(links.map(link => link.parentId).toSorted());
  if (isPending) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">{t('articleLinks.failedLoad')}</Typography>;
  }
  const handleNameChange = (parentId: string, value: string) => {
    onLinkNameChange?.(parentId, value);
  };

  const handleRemove = (parentId: string) => {
    onRemoveLink?.(parentId);
  };

  const handleSelect = (id: string) => {
    if (links.some((link) => link.parentId === id)) {
      return;
    }

    onAddLink?.(id);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('articleLinks.title')}
      </Typography>
      {links.length === 0 ? (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('articleLinks.noLinks')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, flexWrap: "nowrap" }}>
          {links.map((link) => (
            <Paper
              key={link.parentId}
              elevation={1}
              sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, minWidth: '300px', flexShrink: 0 }}
            >
              <Box sx={{ flex: 1 }}>
                <PreviewComponent id={link.parentId} />
                {isEditable ? (
                  <TextField
                    label={t('articleLinks.linkName')}
                    value={link.name}
                    disabled
                    onChange={(event) => handleNameChange(link.parentId, event.target.value)}
                    fullWidth
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">{link.name || t('articleLinks.noDescription')}</Typography>
                )}
              </Box>

              {isEditable && (
                <IconButton
                  aria-label={t('articleLinks.deleteLink')}
                  onClick={() => handleRemove(link.parentId)}
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {isEditable && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('articleLinks.findArticle')}
          </Typography>
          <SearchComponent
            placeholder={t('articleLinks.findArticle')}
            onSelect={handleSelect}
          />
        </Box>
      )}
    </Box>
  );
};

export const ArticleLinksComponent = f.observer(ArticleLinksComponentBase);
