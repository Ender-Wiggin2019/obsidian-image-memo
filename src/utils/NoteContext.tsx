import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { getDateUIDFromFile } from "./daliyNotes";
import { TFile } from "obsidian";

// Types and initial states
interface NotesState {
  dailyNotes: Record<string, any>;
  weeklyNotes: Record<string, any>;
  settings: any;
  activeFile: string | null;
}

interface NotesAction {
  type: string;
  payload: any;
}

const initialState: NotesState = {
  dailyNotes: {},
  weeklyNotes: {},
  settings: {},
  activeFile: null,
};

// Action Types
const REINDEX_DAILY = "REINDEX_DAILY";
const REINDEX_WEEKLY = "REINDEX_WEEKLY";
const SET_ACTIVE_FILE = "SET_ACTIVE_FILE";

// Reducer
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case REINDEX_DAILY:
      return {
        ...state,
        dailyNotes: action.payload,
      };
    case REINDEX_WEEKLY:
      return {
        ...state,
        weeklyNotes: action.payload,
      };
    case SET_ACTIVE_FILE:
      return {
        ...state,
        activeFile: action.payload,
      };
    default:
      return state;
  }
};

// Context
interface NotesContextProps {
  state: NotesState;
  reindexDaily: (data: Record<string, any>) => void;
  reindexWeekly: (data: Record<string, any>) => void;
  setActiveFile: (file: any) => void;
}

const NotesContext = createContext<NotesContextProps | undefined>(undefined);

// Provider
interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const reindexDaily = (data: Record<string, TFile>) => {
    dispatch({ type: REINDEX_DAILY, payload: data });
  };

  const reindexWeekly = (data: Record<string, TFile>) => {
    dispatch({ type: REINDEX_WEEKLY, payload: data });
  };

  const setActiveFile = (file: any) => {
    // Implement getDateUIDFromFile function similar to the Svelte version
    const id = getDateUIDFromFile(file);
    dispatch({ type: SET_ACTIVE_FILE, payload: id });
  };

  return (
    <NotesContext.Provider
      value={{ state, reindexDaily, reindexWeekly, setActiveFile }}
    >
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the notes context
export const useNotes = (): NotesContextProps => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
};
