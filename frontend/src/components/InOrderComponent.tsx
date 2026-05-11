import { useCallback, useMemo, useState } from "react";
import { f } from "../lib";
import { InOrderRule } from "../store/stores/public/InOrder";
import { PreviewListComponent } from "./PreviewListComponent";
import { PreviewOrder, PreviewOrderingProp } from "backend/src/domain/articlePreview/entity";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";

type InOrderComponentProps = {
  initialOrder?: PreviewOrder;
  initialOrderBy?: PreviewOrderingProp;
};

const orderOptions: Array<{ value: PreviewOrder; label: string }> = [
  { value: PreviewOrder.DESC, label: "По убыванию" },
  { value: PreviewOrder.ASC, label: "По возрастанию" },
];

const orderingPropOptions: Array<{ value: PreviewOrderingProp; label: string }> = [
  { value: PreviewOrderingProp.views, label: "Просмотры" },
  { value: PreviewOrderingProp.likes, label: "Лайки" },
  { value: PreviewOrderingProp.learners, label: "Учащихся" },
  { value: PreviewOrderingProp.masters, label: "Мастеров" },
  { value: PreviewOrderingProp.dagPoints, label: "Очки DAG" },
];

const InOrderComponentBase = ({
  initialOrder = PreviewOrder.DESC,
  initialOrderBy = PreviewOrderingProp.learners,
}: InOrderComponentProps) => {
  const [order, setOrder] = useState<PreviewOrder>(initialOrder);
  const [orderBy, setOrderBy] = useState<PreviewOrderingProp>(initialOrderBy);
  const orderDto = useMemo(() => ({ order, orderingProp: orderBy }), [order, orderBy]);

  const { data, isPending, error } = InOrderRule.useResolve(orderDto);

  const handleRefresh = useCallback(async () => {
    await InOrderRule.refresh(orderDto);
  }, [orderDto ]);

  const articleIds = useMemo(
    () => data?.map((preview) => preview.id) ?? [],
    [data]
  );

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setOrder(event.target.value as PreviewOrder);
  };

  const handleOrderByChange = (event: SelectChangeEvent<string>) => {
    setOrderBy(event.target.value as PreviewOrderingProp);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Сортировка статей</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="in-order-order-label">Порядок</InputLabel>
          <Select
            labelId="in-order-order-label"
            value={order}
            label="Порядок"
            onChange={handleOrderChange}
          >
            {orderOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="in-order-order-by-label">Сортировать по</InputLabel>
          <Select
            labelId="in-order-order-by-label"
            value={orderBy}
            label="Сортировать по"
            onChange={handleOrderByChange}
          >
            {orderingPropOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleRefresh}>
          Обновить
        </Button>
      </Stack>

      {isPending ? (
        <Box>
          <CircularProgress size={20} />
          <Typography>Загрузка списка...</Typography>
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error">
          Не удалось загрузить ранжированные статьи
        </Typography>
      ) : (
        <PreviewListComponent ids={articleIds} />
      )}
    </Stack>
  );
};

export const InOrderComponent = f.observer(InOrderComponentBase);
