import { Box, Container } from "@mui/material";
import { f } from "../../lib";
import { SearchComponent } from "../../components";
import { InOrderComponent } from "../../components";

export const TrendingPage = f.observer(() => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <SearchComponent />
      </Box>
      <Box>
        <InOrderComponent />
      </Box>
    </Container>
  );
});

