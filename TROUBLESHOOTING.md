# Troubleshooting Guide

## React Hooks Error - FIXED ✅

**Error**: "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."

**Status**: ✅ **FIXED** - All hooks are now called before any conditional returns in `App.tsx`

## Firebase Project ID Error

**Error**: `projects/your-project-id` in Firestore URLs

**Root Cause**: The Firebase project ID is being set to a placeholder value.

### Solutions:

#### Solution 1: Check .env File
1. Create a `.env` file in the root directory if it doesn't exist
2. Make sure it contains:
   ```env
   VITE_FIREBASE_PROJECT_ID=mission-107ee
   ```
3. **DO NOT** set it to `your-project-id` or any placeholder
4. Restart your dev server after creating/updating `.env`

#### Solution 2: Verify Environment Variables
1. Check browser console - you should see:
   ```
   🔧 Firebase Config: { projectId: "mission-107ee", ... }
   ✅ Firebase project ID is set to: mission-107ee
   ```
2. If you see an error about placeholder, your `.env` file has the wrong value

#### Solution 3: Clear Browser Cache
1. The browser might be caching an old Firebase instance
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Or clear browser cache completely

#### Solution 4: Check for Multiple .env Files
1. Make sure you only have one `.env` file in the root directory
2. Check if there's a `.env.local` or `.env.production` that might be overriding

### How to Verify It's Working:

1. Open browser console
2. Look for these logs:
   ```
   🔧 Firebase Config: { projectId: "mission-107ee", ... }
   ✅ Firebase app initialized successfully
   ✅ Firestore initialized successfully for project: mission-107ee
   ```
3. If you see `your-project-id` anywhere, there's still an issue

## Authentication Errors

### Error: `auth/operation-not-allowed`

**Solution**: Enable Email/Password authentication in Firebase Console
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Click "Save"
4. Wait a few seconds and try again

### Error: Admin user not found

**Solution**: Create admin user
1. Use the setup page: `http://localhost:3000/setup`
2. Or create in Firebase Console → Authentication → Users

## Firestore Errors

### Error: Missing or insufficient permissions

**Solution**: Deploy security rules
1. Copy `firestore.rules` content
2. Go to Firebase Console → Firestore Database → Rules
3. Paste the rules
4. Click "Publish"

### Error: Index not found

**Solution**: Create the index or wait for auto-creation
1. Firebase will usually auto-create the index
2. Or go to Firestore → Indexes → Create Index
3. Collection: `groups`, Field: `createdAt` (Descending)

## Common Issues

### Issue: Can't see Firebase config logs

**Solution**: 
- Make sure you're in development mode
- Check browser console (F12)
- Logs should appear immediately on page load

### Issue: Changes to .env not taking effect

**Solution**:
1. Restart your dev server completely
2. Vite only reads `.env` on server start
3. Make sure file is named exactly `.env` (not `.env.txt`)

### Issue: Still seeing old project ID

**Solution**:
1. Hard refresh browser (`Ctrl+Shift+R`)
2. Clear browser cache
3. Restart dev server
4. Check that `.env` file is in the correct location (project root)

## Verification Steps

1. ✅ Check browser console for Firebase config logs
2. ✅ Verify project ID is `mission-107ee` (not `your-project-id`)
3. ✅ Check that Firestore is initialized successfully
4. ✅ Verify authentication methods are enabled
5. ✅ Check that security rules are deployed
6. ✅ Test admin user creation on `/setup` page
7. ✅ Test login with created admin credentials

## Still Having Issues?

1. Check browser console for detailed error messages
2. Verify Firebase project exists and is active
3. Make sure Firestore database is created
4. Check that all required services are enabled
5. Verify your Firebase project ID matches in:
   - `.env` file
   - Firebase Console
   - Browser console logs

