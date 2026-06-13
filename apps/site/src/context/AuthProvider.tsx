"use client";

import { createContext, type ReactNode, useContext } from "react";
import { type getAuthenticatedUser } from "~/auth";

type User = Awaited<ReturnType<typeof getAuthenticatedUser>>;

const AuthContext = createContext<User>({} as User);

export const useAuthenticatedUser = () => useContext(AuthContext);

export function AuthProvider({ user, children }: { user: User; children?: ReactNode }) {
  // useEffect(() => {
  //   const logoutAction = async () => {
  //     "use server";
  //     await logout();
  //   };
  //   if (!user) {
  //     void logoutAction();
  //   }
  // }, [user]);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
