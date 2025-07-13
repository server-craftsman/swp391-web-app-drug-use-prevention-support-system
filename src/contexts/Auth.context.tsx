import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "../app/enums";
import { AuthService } from "../services/auth/auth.service";
import { useNavigate } from "react-router-dom";
import { HTTP_STATUS } from "../app/enums";
import { HttpException } from "../app/exceptions";
import type { UserResponse } from "../types/user/User.res.type";
import type { ResponseSuccess } from "../app/interface";
import { helpers } from "../utils";

interface AuthContextType {
  role: UserRole | null;
  setRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userInfo: ResponseSuccess<UserResponse>["data"] | null;
  setUserInfo: React.Dispatch<
    React.SetStateAction<ResponseSuccess<UserResponse>["data"] | null>
  >;
  logout: () => void;
  handleLogin: (loginData: {
    email: string;
    password: string;
  }) => Promise<UserResponse>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // const [userInfo, setUserInfo] = useState<
  //   ResponseSuccess<UserResponse>["data"] | null
  // >(null);
  const [userInfo, setUserInfo] = useState<UserResponse | null>(() => {
    const stored = localStorage.getItem('userInfo');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        // Get stored values
        const storedToken = localStorage.getItem("token");
        const storedUserInfo = localStorage.getItem("userInfo");

        // Set token if it exists
        if (storedToken) {
          setToken(storedToken);
          try {
            // Verify and set role from token
            const decoded = jwtDecode(storedToken) as { role?: UserRole };
            if (
              decoded.role &&
              Object.values(UserRole).includes(decoded.role)
            ) {
              setRole(decoded.role);
            } else {
              // Invalid role in token
              throw new Error("Invalid role in token");
            }
          } catch (error) {
            // Token is invalid or expired
            console.error("Token validation error:", error);
            clearAuthData();
          }
        }

        // Set user info if it exists
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    const clearAuthData = () => {
      setToken(null);
      setRole(null);
      setUserInfo(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userInfo");
    };

    initAuth();
  }, []);

  const logout = useCallback(() => {
    setUserInfo(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo");
    navigate("/login", { replace: true });
    helpers.notificationMessage("Đăng xuất thành công!", "success");
  }, [navigate]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [userInfo]);

  const handleLogin = useCallback(
    async (loginData: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await AuthService.login(loginData);
        const userData = response.data.data as UserResponse;

        const token = userData.token;
        if (!token)
          throw new HttpException(
            "No token provided",
            HTTP_STATUS.UNAUTHORIZED
          );

        const decoded = jwtDecode(token) as { role?: UserRole };

        if (!decoded.role || !Object.values(UserRole).includes(decoded.role)) {
          throw new HttpException("Invalid role", HTTP_STATUS.UNAUTHORIZED);
        }

        const userRole = decoded.role;

        // Store values
        setToken(token);
        setRole(userRole);
        setUserInfo(userData);

        // Success message
        helpers.notificationMessage("Đăng nhập thành công!", "success");

        return userData;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [logout]
  );

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        token,
        setToken,
        userInfo,
        setUserInfo,
        logout,
        handleLogin,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new HttpException(
      "useAuth must be used within an AuthProvider",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
  return context;
};
