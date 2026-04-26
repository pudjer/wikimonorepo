import { Box, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ArticleReferenceDto } from "../../api";

interface ArticleReferencesProps {
  links: ArticleReferenceDto[];
}

export function ArticleReferences({ links }: ArticleReferencesProps) {
  const navigate = useNavigate();

  if (links.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        References
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {links.map((link, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Link component="button" onClick={() => navigate(`/article/${link.parent}`)}>
              {link.name}
            </Link>
            <Typography variant="caption" color="text.secondary">
              ({link.parent})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

