import { createContext, useContext } from "react";
import type { RootStore } from "../stores/rootStore";

export const StoreContext = createContext<RootStore | null>(null);

export function useStores() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStores must be used within StoreProvider");
  }
  return context;
}

