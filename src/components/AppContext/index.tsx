import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

import useCurrentUser from "../../hooks/useCurrentUser";

const { api } = window;

type State = {
  currentUser: {
    id: string;
    wallet_id: string;
    avatar: string;
  };
  isSavedSearchOpen: boolean;
  handleSavedSearchBar: (state: boolean) => void;
  isManagerConnected: boolean;
  handleIsManagerConnected: (state: boolean) => void;
  isDownloadsOpen: boolean;
  handleDownloadSidebar: (state: boolean) => void;
};
type AppProviderProps = { children: ReactNode };

const AppContext = createContext<State | undefined>(undefined);

function AppProvider({ children }: AppProviderProps) {
  const { currentUser } = useCurrentUser();
  const [isSavedSearchOpen, setIsSavedSearchOpen] = useState(false);
  const [isManagerConnected, setIsManagerConnected] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(true);

  useEffect(() => {
    api.listenToError((data) => {
      toast.error(data?.data || "An error happened", {
        position: "bottom-center",
        autoClose: 2000,
      });
    });
  }, []);

  const handleSavedSearchBar = (state: boolean) => setIsSavedSearchOpen(state);
  const handleIsManagerConnected = (state: boolean) =>
    setIsManagerConnected(state);
  const handleDownloadSidebar = (state: boolean) => setIsDownloadsOpen(state);

  const value = useMemo(
    () => ({
      currentUser,
      isSavedSearchOpen,
      handleSavedSearchBar,
      isManagerConnected,
      handleIsManagerConnected,
      isDownloadsOpen,
      handleDownloadSidebar,
    }),
    [currentUser, isSavedSearchOpen, isManagerConnected, isDownloadsOpen]
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
