import { useState, useEffect, useCallback, useRef } from 'react';

export type AsyncState<T> = {
  isPending: boolean;
  error: Error | null;
  data: T | undefined;
};

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    isPending: true,
    error: null,
    data: undefined,
  });

  // ref для предотвращения обновления состояния после размонтирования или повторного вызова
  const cancelledRef = useRef(false);

  // стабильная ссылка на функцию, если она меняется (опционально)
  // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  const stableFunction = useCallback(asyncFunction, deps);

  useEffect(() => {
    cancelledRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ isPending: true, error: null, data: undefined });

    stableFunction()
      .then((data) => {
        if (!cancelledRef.current) {
          setState({ isPending: false, error: null, data });
        }
      })
      .catch((error) => {
        if (!cancelledRef.current) {
          setState({ isPending: false, error, data: undefined });
        }
      });

    return () => {
      cancelledRef.current = true;
    };
  }, [stableFunction]);

  return state;
}