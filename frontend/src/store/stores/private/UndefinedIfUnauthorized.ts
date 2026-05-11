import { AxiosError } from "axios";


export const UndefinedIfUnauthorized = async <T>(promise: Promise<T>): Promise<T | undefined> => {
  try {
    return await promise;
  } catch (e) {
    if (e instanceof AxiosError && e.status === 401) {
      return;
    }
    throw e;
  }
};