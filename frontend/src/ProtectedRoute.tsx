import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./ui/Loading";
import { Axios } from "./api/api";
import type { ApiResponse } from "./api/types";
import type { IUser } from "./types/auth";

interface ProtectedRouteProps {
  adminOnly?: boolean; // if true, only admins can access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await Axios.get<ApiResponse<IUser>>("/auth/me")

        if (adminOnly && res.data.data.role !== "admin") {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (err) {
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [adminOnly]);

  if (loading) return <Loading />;

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;