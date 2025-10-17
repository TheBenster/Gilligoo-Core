import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import GithubProvider from "next-auth/providers/github";

// NextAuth configuration - must match the one in route.js
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const adminGitHubId = process.env.ADMIN_GITHUB_ID;
      const userGitHubId = user.id;

      console.log("🔍 SIGNIN CHECK - Auth.js");
      console.log("User GitHub ID:", userGitHubId);
      console.log("Admin GitHub ID:", adminGitHubId);
      console.log("Match?", String(userGitHubId) === String(adminGitHubId));

      return String(userGitHubId) === String(adminGitHubId);
    },
    async session({ session, token }) {
      const adminGitHubId = process.env.ADMIN_GITHUB_ID;

      // Get ID from token or session (token.sub is the GitHub ID)
      const userId = token.sub || session.user?.id || token.id;

      // Ensure session.user exists
      if (!session.user) {
        session.user = {};
      }

      session.user.id = userId;

      // Multiple checks to be absolutely sure
      const isAdminCheck1 = String(userId) === String(adminGitHubId);
      const isAdminCheck2 = Number(userId) === Number(adminGitHubId);
      const isAdminCheck3 = userId === adminGitHubId;
      const isAdminCheck4 = String(userId) === "105664089";

      session.user.isAdmin = isAdminCheck1 || isAdminCheck2 || isAdminCheck3 || isAdminCheck4;

      console.log("📋 SESSION CALLBACK - Auth.js");
      console.log("Token sub:", token.sub);
      console.log("Session user ID:", session.user.id);
      console.log("Token ID:", token.id);
      console.log("Admin GitHub ID from env:", adminGitHubId);
      console.log("String match:", isAdminCheck1);
      console.log("Number match:", isAdminCheck2);
      console.log("Direct match:", isAdminCheck3);
      console.log("Hardcoded match:", isAdminCheck4);
      console.log("Final Is Admin?", session.user.isAdmin);

      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true, // Enable debug mode
};

export async function getSession(req) {
  return await getServerSession(authOptions);
}

export async function requireAdmin(request) {
  const session = await getServerSession(authOptions);

  console.log("🔒 REQUIRE ADMIN CHECK");
  console.log("Session exists?", !!session);
  console.log("User:", session?.user);
  console.log("Is Admin?", session?.user?.isAdmin);

  if (!session) {
    console.log("❌ No session found");
    return NextResponse.json(
      { message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  if (!session.user?.isAdmin) {
    console.log("❌ User is not admin");
    return NextResponse.json(
      { message: "Unauthorized. Admin access required." },
      { status: 403 }
    );
  }

  console.log("✅ Admin access granted");
  return null; // No error, user is admin
}

export function isAdmin(session) {
  return session?.user?.isAdmin === true;
}