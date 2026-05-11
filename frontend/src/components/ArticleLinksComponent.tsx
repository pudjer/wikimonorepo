import { useState } from "react";
import { f } from "../lib";
import DeleteIcon from "@mui/icons-material/Delete";
import { SearchComponent } from "./SearchComponent";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type ArticleLinkInfo = {
  parentId: string;
  name: string;
  parentTitle?: string;
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
  const [currentLinks, setCurrentLinks] = useState<ArticleLinkInfo[]>(links);


  const handleNameChange = (parentId: string, value: string) => {
    const nextState = currentLinks.map((link) =>
      link.parentId === parentId ? { ...link, name: value } : link
    );
    setCurrentLinks(nextState);
    onLinkNameChange?.(parentId, value);
  };

  const handleRemove = (parentId: string) => {
    setCurrentLinks((prev) => prev.filter((link) => link.parentId !== parentId));
    onRemoveLink?.(parentId);
  };

  const handleSelect = (id: string) => {
    if (currentLinks.some((link) => link.parentId === id)) {
      return;
    }

    onAddLink?.(id);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Связи статьи
      </Typography>
      {currentLinks.length === 0 ? (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Нет связанных статей.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {currentLinks.map((link) => (
            <Box key={link.parentId}>
              <Box >
                <Typography variant="body2" color="text.secondary">
                  {link.parentTitle ?? link.parentId}
                </Typography>
                {isEditable ? (
                  <TextField
                    label="Название связи"
                    value={link.name}
                    onChange={(event) => handleNameChange(link.parentId, event.target.value)}
                    fullWidth
                    size="small"
                  />
                ) : (
                  <Typography variant="body1">{link.name || "Без описания"}</Typography>
                )}
              </Box>
              {isEditable && (
                <IconButton
                  aria-label="Удалить связь"
                  onClick={() => handleRemove(link.parentId)}
                  size="large"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </Stack>
      )}

      {isEditable && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Найти статью для связи
          </Typography>
          <SearchComponent
            placeholder="Найти статью для связи"
            onSelect={handleSelect}
          />
          <Box>
            <Button
              onClick={() => {
                setCurrentLinks(links);
              }}
              disabled={JSON.stringify(currentLinks) === JSON.stringify(links)}
            >
              Сбросить изменения
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export const ArticleLinksComponent = f.observer(ArticleLinksComponentBase);
