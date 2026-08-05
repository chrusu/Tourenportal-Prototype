import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

/**
 * Fake demo user for the prototype's fake login. Fittingly for a Swiss
 * alpine club, an experienced (fictional) mountaineer.
 */
export const FAKE_USER: AuthUser = {
  id: "fake-user-miriam-felsberg",
  name: "Miriam Felsberg",
  email: "miriam.felsberg@sac-bern.ch",
  avatarUrl: "https://i.pravatar.cc/160?u=miriam.felsberg",
};

const AUTH_STORAGE_KEY = "tourenportal.auth.loggedIn";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Fake login: no credentials are actually checked. */
  login: () => void;
  logout: () => void;
  isLoginDialogOpen: boolean;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === "1";
  });
  const [isLoginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? "1" : "0");
  }, [isAuthenticated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: isAuthenticated ? FAKE_USER : null,
      isAuthenticated,
      login: () => {
        setIsAuthenticated(true);
        setLoginDialogOpen(false);
      },
      logout: () => setIsAuthenticated(false),
      isLoginDialogOpen,
      openLoginDialog: () => setLoginDialogOpen(true),
      closeLoginDialog: () => setLoginDialogOpen(false),
    }),
    [isAuthenticated, isLoginDialogOpen]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
