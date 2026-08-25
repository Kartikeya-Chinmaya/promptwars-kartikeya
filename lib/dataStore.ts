import { Need, Profile } from "./types";
import { seedNeeds, seedProfiles } from "./seed";

const STORAGE_KEY = "promptwars-data-v1";

interface StoreState {
  profiles: Profile[];
  needs: Need[];
}

const initialState: StoreState = { profiles: seedProfiles, needs: seedNeeds };

let state: StoreState = initialState;
let hasHydrated = false;
const listeners = new Set<() => void>();

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadFromStorage(): StoreState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      profiles: parsed.profiles?.length ? parsed.profiles : initialState.profiles,
      needs: parsed.needs?.length ? parsed.needs : initialState.needs,
    };
  } catch {
    return null;
  }
}

function persist(next: StoreState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable (private mode, quota) — matching still works in-memory
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: StoreState) {
  state = next;
  persist(state);
  emit();
}

export const dataStore = {
  // React calls subscribe once per mounted consumer; the hydration read only
  // needs to happen once globally; the `hasHydrated` guard keeps it that way.
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!hasHydrated) {
      hasHydrated = true;
      const stored = loadFromStorage();
      if (stored) {
        state = stored;
        emit();
      }
    }
    return () => listeners.delete(listener);
  },
  getSnapshot(): StoreState {
    return state;
  },
  getServerSnapshot(): StoreState {
    return initialState;
  },
  addProfile(profile: Omit<Profile, "id">): Profile {
    const newProfile: Profile = { ...profile, id: makeId("profile") };
    setState({ ...state, profiles: [...state.profiles, newProfile] });
    return newProfile;
  },
  addNeed(need: Omit<Need, "id">): Need {
    const newNeed: Need = { ...need, id: makeId("need") };
    setState({ ...state, needs: [...state.needs, newNeed] });
    return newNeed;
  },
};
