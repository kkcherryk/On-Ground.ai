import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import { createSeed } from '../data/seed';
import type { AppState, Availability } from '../data/types';
const STORAGE_KEY = 'xeloro-demo-v1';
type Action =
  | { type: 'availability'; value: Availability }
  | { type: 'select'; id: string }
  | { type: 'assist' }
  | { type: 'reset' };
function readState(): AppState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    const initial = createSeed();
    if (
      saved?.version === 1 &&
      Array.isArray(saved.agents) &&
      initial.agents.some((a) => a.id === saved.currentAgentId) &&
      ['Ready', 'Busy', 'Break', 'Offline'].includes(
        saved.agents.find((a: { id: string }) => a.id === saved.currentAgentId)?.availability,
      )
    ) {
      return {
        ...initial,
        selectedInteractionId: initial.interactions.some(
          (i) => i.id === saved.selectedInteractionId,
        )
          ? saved.selectedInteractionId
          : initial.selectedInteractionId,
        assistEnabled:
          typeof saved.assistEnabled === 'boolean' ? saved.assistEnabled : initial.assistEnabled,
        agents: initial.agents.map((a) =>
          a.id === saved.currentAgentId
            ? {
                ...a,
                availability: saved.agents.find((s: { id: string }) => s.id === a.id).availability,
              }
            : a,
        ),
      };
    }
  } catch {
    /* A damaged or unavailable browser store falls back to sample records. */
  }
  return createSeed();
}
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'availability':
      return {
        ...state,
        agents: state.agents.map((a) =>
          a.id === state.currentAgentId ? { ...a, availability: action.value } : a,
        ),
      };
    case 'select':
      return state.interactions.some((i) => i.id === action.id)
        ? { ...state, selectedInteractionId: action.id }
        : state;
    case 'assist':
      return { ...state, assistEnabled: !state.assistEnabled };
    case 'reset':
      return createSeed();
  }
}
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  persistent: boolean;
} | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readState);
  const [persistent, setPersistent] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setPersistent(true);
    } catch {
      setPersistent(false);
    }
  }, [state]);
  return (
    <AppContext.Provider value={{ state, dispatch, persistent }}>{children}</AppContext.Provider>
  );
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('AppProvider is required');
  return context;
}
