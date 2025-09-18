import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const handler = NextAuth({
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
      // Use GitHub ID instead of email for admin check
      const adminGitHubId = process.env.ADMIN_GITHUB_ID;
      const userGitHubId = user.id;

      console.log("🔍 SIGNIN CALLBACK - GitHub ID Check");
      console.log("User GitHub ID:", userGitHubId);
      console.log("Admin GitHub ID:", adminGitHubId);
      console.log("Match?", userGitHubId === adminGitHubId);

      return userGitHubId === adminGitHubId;
    },
    async session({ session, token }) {
      // Add admin flag to session using GitHub ID
      const adminGitHubId = process.env.ADMIN_GITHUB_ID;
      session.user.isAdmin = session.user.id === adminGitHubId;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
})

export { handler as GET, handler as POST }