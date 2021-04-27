import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import useCurrentUser from "../../hooks/useCurrentUser";

type State = {
  currentUser: {
    id: string;
    wallet_id: string;
    avatar: string;
  };
  isSavedSearchOpen: boolean;
  handleSavedSearchBar: (state: boolean) => void;
};
type AppProviderProps = { children: ReactNode };

const AppContext = createContext<State | undefined>(undefined);

function AppProvider({ children }: AppProviderProps) {
  const { currentUser } = useCurrentUser();
  const [isSavedSearchOpen, setIsSavedSearchOpen] = useState(false);

  const handleSavedSearchBar = (state: boolean) => setIsSavedSearchOpen(state);

  const value = useMemo(
    () => ({
      currentUser,
      isSavedSearchOpen,
      handleSavedSearchBar,
    }),
    [currentUser, isSavedSearchOpen]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }

  return context;
}

export { AppProvider, useAppContext };
