import { AxiosError } from "axios";


export const NullIfUnauthorized = async <T>(promise: Promise<T>): Promise<T | null> => {
  try {
    return await promise;
  } catch (e) {
    if (e instanceof AxiosError && e.status === 401) {
      return null;
    }
    throw e;
  }
};