/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect, useRef } from "react";
import { f } from "../lib";
import { Search } from "../store/stores/public/SearchPreviews";
import {
  Box,
  TextField,
  Stack,
  Typography,
  Skeleton,
  InputAdornment,
  CircularProgress,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ArticleSearchResultDto } from "../api/queryApi";
import { PreviewListComponent } from "./PreviewListComponent";

type SearchComponentProps = {
  initialQuery?: string;
  placeholder?: string;
  onSelect?: (id: string) => void;
  authorIds?: string[];
  articleIds?: string[];
};

const SearchComponentBase = ({
  initialQuery = "",
  placeholder = "Поиск статей...",
  onSelect,
  authorIds,
  articleIds,
}: SearchComponentProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ArticleSearchResultDto[] | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const queryPayload = useMemo(
    () => ({
      query: query.trim(),
      authorIds: authorIds?.length ? authorIds : undefined,
      articleIds: articleIds?.length ? articleIds : undefined,
    }),
    [query, authorIds, articleIds]
  );

  useEffect(() => {
    if (!queryPayload.query) {
      setResults(null);
      setError(null);
      setIsPending(false);
      setIsDropdownOpen(false);
      return;
    }

    setIsDropdownOpen(true);

    let mounted = true;
    const timer = window.setTimeout(async () => {
      setIsPending(true);
      setError(null);

      try {
        const data = await Search(queryPayload);
        if (!mounted) {
          return;
        }
        setResults(data);
      } catch (e) {
        if (!mounted) {
          return;
        }
        setError("Не удалось выполнить поиск");
        setResults([]);
      } finally {
        if (!mounted) {
          // eslint-disable-next-line no-unsafe-finally
          return;
        }
        setIsPending(false);
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [queryPayload]);

  const handleSelect = (id: string) => {
    if (typeof onSelect === "function") {
      onSelect(id);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <Stack spacing={2}>
      <Box ref={rootRef} sx={{ position: "relative" }}>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (queryPayload.query) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder={placeholder}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {isPending ? <CircularProgress size={18} /> : <SearchIcon />}
                </InputAdornment>
              ),
            },
          }}
        />

        {isDropdownOpen && (queryPayload.query || error || (isPending && !results) || (results && results.length >= 0)) && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 10,
              maxHeight: 420,
              overflow: "auto",
              p: 2,
            }}
          >
            {!queryPayload.query ? (
              <Typography variant="body2" color="text.secondary">
                Введите запрос для поиска
              </Typography>
            ) : error ? (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            ) : isPending && !results ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((index) => (
                  <Box key={index}>
                    <Skeleton width="100%" height={112} />
                  </Box>
                ))}
              </Stack>
            ) : results && results.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Ничего не найдено
              </Typography>
            ) : results && (
              <PreviewListComponent ids={results!.map((result) => result.id)} onSelect={handleSelect}/>
            )}
          </Paper>
        )}
      </Box>
    </Stack>
  );
};

export const SearchComponent = f.observer(SearchComponentBase);
