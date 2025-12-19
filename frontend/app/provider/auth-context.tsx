import type { User } from "@/types/indedx";
import { createContext, useContext, useEffect, useState } from "react";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { publicRoutes } from "@/lib";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const currentPath = useLocation().pathname;
  const isPublicRoute = publicRoutes.includes(currentPath);

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        const storedUser = Cookies.get("user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          if (!isPublicRoute) {
            navigate("/sign-in");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      logout();
      navigate("/sign-in");
    };
    window.addEventListener("force-logout", handleLogout);
    return () => window.removeEventListener("force-logout", handleLogout);
  }, []);

  const login = async (data: any) => {
    Cookies.set("token", data.token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    Cookies.set("user", JSON.stringify(data.user), {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    Cookies.remove("token");
    Cookies.remove("user");

    setUser(null);
    setIsAuthenticated(false);
    navigate("/sign-in");

    queryClient.clear();
  };

  const values = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
