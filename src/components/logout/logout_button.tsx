"use client";

import { signOut } from "next-auth/react";


interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function LogoutButton({ children, className }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div onClick={handleLogout} className={className}>
      {children || "Sair"}
    </div>
  );
}
