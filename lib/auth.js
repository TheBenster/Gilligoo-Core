import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// Get NextAuth configuration
const authOptions = {
  providers: [], // This will be imported from the route handler
  callbacks: {
    async session({ session, token }) {
      const adminGitHubId = process.env.ADMIN_GITHUB_ID;
      session.user.isAdmin = session.user.id === adminGitHubId;
      return session;
    },
  },
};

export async function getSession(req) {
  return await getServerSession(authOptions);
}

export async function requireAdmin(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      { message: "Unauthorized. Admin access required." },
      { status: 401 }
    );
  }

  return null; // No error, user is admin
}

export function isAdmin(session) {
  return session?.user?.isAdmin === true;
}