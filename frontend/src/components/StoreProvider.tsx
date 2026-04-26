import type { ReactNode } from "react";
import { StoreContext } from "../hooks/useStores";
import type { RootStore } from "../stores/rootStore";

export function StoreProvider({ store, children }: { store: RootStore; children: ReactNode }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

