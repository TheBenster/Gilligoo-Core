# 🔐 Authentication Setup Guide

Your Goblin Merchant Chronicles now has GitHub OAuth authentication! Here's how to set it up:

## 🚀 Quick Setup

### 1. Create GitHub OAuth App
1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/applications/new)
2. Fill in:
   - **Application name**: `Goblin Merchant Chronicles`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### 2. Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Fill in your values:
   ```
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-random-secret-key
   GITHUB_ID=your-github-client-id
   GITHUB_SECRET=your-github-client-secret
   ADMIN_EMAIL=your-email@example.com
   ```

### 3. Generate NEXTAUTH_SECRET
Run this in your terminal:
```bash
openssl rand -base64 32
```

## 🎯 How It Works

- **Public Access**: Anyone can view your blog, lore, and inventory
- **Admin Only**: Only you (with your GitHub email) can:
  - Add/edit/delete posts
  - Add/edit/delete lore entries
  - Add/edit/delete inventory items
  - Upload images

## 🔑 Admin Features

When logged in as admin, you'll see:
- 👑 **Grand Merchant** badge in navigation
- **Add** buttons for creating content
- **Edit/Delete** buttons on existing content

## 🚪 Login Flow

1. Click "🗝️ Admin Login" in navigation
2. Sign in with GitHub
3. Only your configured email gets admin access
4. Others see "Access Forbidden" page

## 🛡️ Security Features

- Protected API endpoints (POST/PUT/DELETE require admin)
- Email-based admin verification
- Secure session management with NextAuth.js
- GitHub OAuth for trusted authentication

Your goblin archives are now secure! 🗝️✨