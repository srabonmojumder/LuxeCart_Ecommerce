---
description: How to deploy LuxeCart to Firebase Hosting
---

# Deploy LuxeCart to Firebase Hosting

This guide explains how to deploy your LuxeCart e-commerce application to Firebase Hosting.

## Prerequisites

Before deploying, ensure you have:
- ✅ Firebase CLI installed (`firebase --version` to check)
- ✅ Firebase project created (luxecart-store)
- ✅ Logged into Firebase CLI (`firebase login`)

## Deployment Steps

### 1. Build the Production Bundle

First, create an optimized production build of your Next.js application:

```bash
npm run build
```

This command will:
- Compile your Next.js application
- Generate static HTML files in the `out` directory
- Pre-render all 48 product pages
- Optimize images and assets
- Create a production-ready bundle

**Expected output**: You should see all routes listed with ○ (Static) or ● (SSG) indicators.

### 2. Deploy to Firebase Hosting

Deploy the built application to Firebase:

```bash
firebase deploy --only hosting
```

This command will:
- Upload all files from the `out` directory to Firebase Hosting
- Configure routing rules
- Make your site live

**Deployment time**: Usually takes 1-3 minutes depending on your internet speed.

### 3. Verify Deployment

After deployment completes, you'll see:
- ✅ **Hosting URL**: https://luxecart-store.web.app
- ✅ **Project Console**: https://console.firebase.google.com/project/luxecart-store/overview

Visit the Hosting URL to verify your site is live!

## Quick Deploy (One Command)

To build and deploy in one go:

```bash
npm run build && firebase deploy --only hosting
```

## Configuration Files

Your project is already configured with:

### `next.config.mjs`
```javascript
{
  output: 'export',  // Enables static export
  images: {
    unoptimized: true  // Required for static export
  }
}
```

### `firebase.json`
```json
{
  "hosting": {
    "public": "out",  // Next.js export directory
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"  // SPA routing
      }
    ]
  }
}
```

### `.firebaserc`
```json
{
  "projects": {
    "default": "luxecart-store"
  }
}
```

## Troubleshooting

### Issue: "Firebase command not found"
**Solution**: Install Firebase CLI globally
```bash
npm install -g firebase-tools
```

### Issue: "Not logged in"
**Solution**: Login to Firebase
```bash
firebase login
```

### Issue: "Build fails"
**Solution**: Check for errors in your code and ensure all dependencies are installed
```bash
npm install
npm run build
```

### Issue: "Deployment fails"
**Solution**: Ensure you're in the correct project directory and have proper permissions
```bash
firebase use luxecart-store
firebase deploy --only hosting
```

## Updating Your Deployment

When you make changes to your site:

1. **Make your code changes**
2. **Test locally**:
   ```bash
   npm run dev
   ```
3. **Build the production version**:
   ```bash
   npm run build
   ```
4. **Deploy the updates**:
   ```bash
   firebase deploy --only hosting
   ```

## Custom Domain (Optional)

To add a custom domain:

1. Go to [Firebase Console](https://console.firebase.google.com/project/luxecart-store/hosting)
2. Click "Add custom domain"
3. Follow the DNS configuration steps
4. Wait for SSL certificate provisioning (can take up to 24 hours)

## Deployment Checklist

Before deploying to production:

- [ ] Test all pages locally (`npm run dev`)
- [ ] Check responsive design on different screen sizes
- [ ] Verify dark mode works correctly
- [ ] Test all interactive features (cart, wishlist, etc.)
- [ ] Run production build locally to catch any build errors
- [ ] Review Firebase Hosting quota (free tier has limits)
- [ ] Backup your code (commit to Git)

## Firebase Hosting Features

Your deployment includes:

- ✅ **Global CDN**: Fast loading worldwide
- ✅ **SSL Certificate**: Automatic HTTPS
- ✅ **Custom Domain Support**: Add your own domain
- ✅ **Rollback Support**: Revert to previous versions
- ✅ **Preview Channels**: Test before going live

## Monitoring Your Site

After deployment, monitor your site:

1. **Firebase Console**: View hosting metrics
2. **Analytics**: Track user behavior (if configured)
3. **Performance**: Monitor page load times

## Cost

Firebase Hosting free tier includes:
- 10 GB storage
- 360 MB/day bandwidth
- Custom domain support
- SSL certificates

Your static LuxeCart site should easily fit within these limits!

## Live URLs

- **Production Site**: https://luxecart-store.web.app
- **Firebase Console**: https://console.firebase.google.com/project/luxecart-store/overview

---

**Need help?** Check the [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
