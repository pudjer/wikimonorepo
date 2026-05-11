import { useNavigate } from "react-router-dom";
import { f } from "../lib";
import { AuthorRule } from "../store/stores/public/Author";
import { Box, Button, Skeleton, Typography } from "@mui/material";

type AuthorComponentProps = {
  id: string;
};

const AuthorComponentBase = ({ id }: AuthorComponentProps) => {
  const { data, isPending, error } = AuthorRule.useResolve(id, [id]);
  const navigate = useNavigate();
  if (isPending) {
    return (
      <Box>
        <Skeleton width={120} height={20} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Typography variant="body2" color="error">
        Автор не найден
      </Typography>
    );
  }

  return (
    <Button color="primary" onClick={()=>navigate(`/author/${id}`)}>
      Автор: {data.username}
    </Button>
  );
};

export const AuthorComponent = f.observer(AuthorComponentBase);
