import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: "user" | "admin";
    canViewLogs: boolean;
    canManageScheduling: boolean;
    status: "active" | "inactive";
    accessToken: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      lastName: string;
      role: "user" | "admin";
      canViewLogs: boolean;
      canManageScheduling: boolean;
      status: "active" | "inactive";
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: "user" | "admin";
    canViewLogs: boolean;
    canManageScheduling: boolean;
    status: "active" | "inactive";
    accessToken: string;
  }
}
