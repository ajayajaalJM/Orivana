import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { MemberOrder } from "./membership-types";
import {
  createIndividualMember,
  getMemberByEmail,
  getMemberOrders as getStoredOrders,
  verifyPassword,
} from "./membership-store";

export type { MemberOrder };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Inner Circle",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();
        let member = getMemberByEmail(email);

        if (!member) {
          if (credentials.password.length < 6) return null;
          member = createIndividualMember(email, credentials.password);
        } else if (!verifyPassword(member, credentials.password)) {
          return null;
        }

        if (member.applicationStatus === "pending") {
          return null;
        }

        return {
          id: member.id,
          email: member.email,
          name: member.name,
          tier: member.tier,
          applicationStatus: member.applicationStatus,
          businessName: member.businessName,
          chefSupplyMode: member.chefSupplyMode,
        };
      },
    }),
  ],
  pages: {
    signIn: "/membership/login",
    signOut: "/membership",
    error: "/membership/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.tier = user.tier;
        token.applicationStatus = user.applicationStatus;
        token.businessName = user.businessName;
        token.chefSupplyMode = user.chefSupplyMode;
      }

      if (trigger === "update" && session) {
        if (session.chefSupplyMode !== undefined) {
          token.chefSupplyMode = session.chefSupplyMode;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.tier = token.tier;
        session.user.applicationStatus = token.applicationStatus;
        session.user.businessName = token.businessName;
        session.user.chefSupplyMode = token.chefSupplyMode;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "orivana-dev-secret-change-in-production",
};

export async function getSession() {
  return getServerSession(authOptions);
}

export async function getMemberOrders(memberId?: string): Promise<MemberOrder[]> {
  if (!memberId) return [];
  return getStoredOrders(memberId);
}

export async function registerMember(email: string, password: string, name?: string) {
  const member = createIndividualMember(email, password, name);
  return { success: true, email: member.email, name: member.name };
}
