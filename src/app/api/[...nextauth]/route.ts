import NextAuth from "next-auth";
import { authConfig } from "@/core/lib/auth_config";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
