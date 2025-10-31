# Deployment Guide - Goblin Merchant Chronicles

## The Problem

Your MongoDB works locally but not in production because:

1. **Environment variables aren't set during build** - Your deployment platform needs MONGODB_URI available during the build phase
2. **NEXTAUTH_URL is set to localhost** - This breaks authentication in production
3. **Static generation requires database access** - The build process tries to pre-generate blog post pages by connecting to MongoDB

## Solution: Configure Environment Variables in Your Deployment Platform

### For Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables for **ALL deploy contexts** (Production, Deploy Previews, Branch deploys):

```
MONGODB_URI=mongodb+srv://theonebenster:lhovdPR4uF86ihsk@goblin-chronicles.1uzuk0v.mongodb.net/?retryWrites=true&w=majority&appName=goblin-chronicles

NEXTAUTH_URL=https://your-production-domain.netlify.app
NEXTAUTH_SECRET=ZhTPX+GEHS/9e2rduJKJw209H/mqxYCkMqdFK3JKy38=

GITHUB_ID=Ov23limeQVsKUoUHUUyX
GITHUB_SECRET=60b2147e7582f5670246259446d3bf2dadcb6751

ADMIN_GITHUB_ID=105664089

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dauffqsfj
CLOUDINARY_API_KEY=947392696563255
CLOUDINARY_API_SECRET=VsGXKJkywRJDyLevpyGYd_LJ1qk
```

5. **IMPORTANT**: Replace `https://your-production-domain.netlify.app` with your actual Netlify URL

### For Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the same variables as above for all environments (Production, Preview, Development)

## Why This Fixes the Problem

### Build Time vs Runtime

Your app has two phases where it needs MongoDB:

**Build Time** (`npm run build`):
- `generateStaticParams()` in [slug]/page.js tries to fetch all blog posts
- Pre-generates static HTML pages for each post
- **Needs MONGODB_URI to work**

**Runtime** (when users visit):
- API routes in /api/posts/route.js handle creating/updating posts
- Also needs MONGODB_URI

If MONGODB_URI is missing during build:
- ✅ Build completes (returns empty arrays)
- ❌ No static pages generated
- ❌ Blog posts don't work properly
- ❌ New posts can't be created

## Verification Steps

After setting environment variables:

1. **Trigger a new deploy** (push a commit or manually redeploy)
2. **Check build logs** for these messages:
   ```
   🔄 Connecting to MongoDB...
   ✅ Connected to MongoDB successfully
   ```
3. **Test your site**:
   - Visit /blog - should show existing posts
   - Click on a post - should load the full post
   - Login as admin - should be able to create new posts

## Security Notice

**CRITICAL**: Your MongoDB credentials are currently in your local .env.local file. While this file is in .gitignore and not committed to git (good!), you should still:

1. ✅ Keep .env.local in .gitignore (already done)
2. ⚠️ Consider rotating your MongoDB password if you've shared the repository
3. ⚠️ Never commit .env.local to git
4. ✅ Use .env.local.example as a template for others

## Troubleshooting

### Build succeeds but posts don't work:

Check your deployment platform's build logs for:
```
⚠️ Skipping database connection - no MONGODB_URI provided
```

This means MONGODB_URI isn't set during build.

### Authentication doesn't work:

Make sure NEXTAUTH_URL is set to your production domain:
```
NEXTAUTH_URL=https://your-actual-site.com
```

NOT:
```
NEXTAUTH_URL=http://localhost:3000  ❌
```

### Posts work but admin features don't:

Check that all auth variables are set:
- NEXTAUTH_SECRET
- GITHUB_ID
- GITHUB_SECRET
- ADMIN_GITHUB_ID

### MongoDB connection timeouts:

Your current connection settings:
```javascript
serverSelectionTimeoutMS: 10000  // 10 seconds
socketTimeoutMS: 45000           // 45 seconds
```

If you see timeout errors, your MongoDB Atlas cluster might be:
- In a different region (high latency)
- Blocking your deployment platform's IP addresses
- Under heavy load

**Fix for IP restrictions:**
1. Go to MongoDB Atlas
2. Network Access → IP Access List
3. Add `0.0.0.0/0` (allow all) for testing
4. Later, add your deployment platform's specific IP ranges

## Next Steps

1. Set all environment variables in your deployment platform
2. Redeploy your site
3. Test creating and viewing posts
4. Monitor build logs for any errors

## Additional Configuration (Optional)

### Using ISR (Incremental Static Regeneration)

If you want posts to update without full rebuilds, add to your [slug]/page.js:

```javascript
export const revalidate = 60; // Revalidate every 60 seconds
```

This makes Next.js regenerate static pages periodically in production.
