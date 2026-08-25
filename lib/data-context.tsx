"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode } from "react";
import { Need, Profile } from "./types";
import { dataStore } from "./dataStore";

interface DataContextValue {
  profiles: Profile[];
  needs: Need[];
  addProfile: (profile: Omit<Profile, "id">) => Profile;
  addNeed: (need: Omit<Need, "id">) => Need;
  getProfile: (id: string) => Profile | undefined;
  getNeed: (id: string) => Need | undefined;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { profiles, needs } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot,
    dataStore.getServerSnapshot,
  );

  function getProfile(id: string) {
    return profiles.find((p) => p.id === id);
  }

  function getNeed(id: string) {
    return needs.find((n) => n.id === id);
  }

  return (
    <DataContext.Provider
      value={{
        profiles,
        needs,
        addProfile: dataStore.addProfile,
        addNeed: dataStore.addNeed,
        getProfile,
        getNeed,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
