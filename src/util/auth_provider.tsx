"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type SessionContextProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<SessionContextProps> = ({ children }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
