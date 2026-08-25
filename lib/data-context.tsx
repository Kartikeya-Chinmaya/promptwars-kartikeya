"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Need, Profile } from "./types";
import { seedNeeds, seedProfiles } from "./seed";

const STORAGE_KEY = "promptwars-data-v1";

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

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
  const [profiles, setProfiles] = useState<Profile[]>(seedProfiles);
  const [needs, setNeeds] = useState<Need[]>(seedNeeds);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { profiles?: Profile[]; needs?: Need[] };
        if (parsed.profiles?.length) setProfiles(parsed.profiles);
        if (parsed.needs?.length) setNeeds(parsed.needs);
      }
    } catch {
      // ignore malformed storage, fall back to seed data already in state
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profiles, needs }));
    } catch {
      // storage unavailable (private mode, quota) — matching still works in-memory
    }
  }, [profiles, needs]);

  function addProfile(profile: Omit<Profile, "id">): Profile {
    const newProfile: Profile = { ...profile, id: makeId("profile") };
    setProfiles((prev) => [...prev, newProfile]);
    return newProfile;
  }

  function addNeed(need: Omit<Need, "id">): Need {
    const newNeed: Need = { ...need, id: makeId("need") };
    setNeeds((prev) => [...prev, newNeed]);
    return newNeed;
  }

  function getProfile(id: string) {
    return profiles.find((p) => p.id === id);
  }

  function getNeed(id: string) {
    return needs.find((n) => n.id === id);
  }

  return (
    <DataContext.Provider value={{ profiles, needs, addProfile, addNeed, getProfile, getNeed }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
