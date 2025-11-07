# Quick Start Guide

## 🚀 Getting Started

### 1. Fix Firebase Project ID Issue

The error `projects/your-project-id` means your Firebase config is using a placeholder. 

**Solution:**
1. Check your `.env` file exists in the root directory
2. Make sure it has the correct Firebase project ID:
   ```env
   VITE_FIREBASE_PROJECT_ID=mission-107ee
   ```
3. If you don't have a `.env` file, create one with your Firebase config values
4. Restart your dev server after creating/updating `.env`

**To verify:**
- Open browser console
- You should see "Firebase Config:" log with your project ID
- If you see a warning about placeholder, check your `.env` file

### 2. Enable Firebase Services

#### Enable Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mission-107ee`
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** (for admin)
5. Enable **Anonymous** (for users/agents)

#### Enable Firestore
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** (we have security rules)
4. Choose a location
5. Click **Enable**

### 3. Create Admin User

#### Option A: Using Hidden Setup Page (Recommended)
1. Navigate to: `http://localhost:3000/setup`
2. Enter admin email and password
3. Click "Create Admin User"
4. Go back to login page and use those credentials

#### Option B: Using Firebase Console
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Use those credentials to log in

### 4. Deploy Security Rules

**Quick Method (Firebase Console):**
1. Go to Firestore Database → Rules
2. Copy contents of `firestore.rules`
3. Paste into the rules editor
4. Click "Publish"

**CLI Method:**
```bash
firebase deploy --only firestore:rules
```

## 🎯 Access Points

- **Main App**: `http://localhost:3000/`
- **Admin Setup**: `http://localhost:3000/setup` or `http://localhost:3000/admin-setup`
- **Login Page**: `http://localhost:3000/` (when not logged in)

## 📝 Troubleshooting

### Firestore 400 Errors
**Problem**: `projects/your-project-id` in error messages

**Solutions:**
1. Check `.env` file has correct `VITE_FIREBASE_PROJECT_ID`
2. Restart dev server after changing `.env`
3. Clear browser cache
4. Verify project ID in Firebase Console matches your `.env`

### Authentication Errors
**Problem**: `auth/operation-not-allowed`

**Solution**: Enable Email/Password authentication in Firebase Console

### Cannot Create Admin User
**Problem**: Setup page shows errors

**Solutions:**
1. Make sure Email/Password auth is enabled
2. Check Firebase project is active
3. Verify Firestore is enabled
4. Check browser console for detailed errors

## ✅ Verification Checklist

- [ ] `.env` file exists with correct Firebase config
- [ ] Firebase project ID matches in `.env` and console
- [ ] Email/Password authentication enabled
- [ ] Anonymous authentication enabled
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Admin user created (via setup page or console)
- [ ] Can log in as admin
- [ ] Can create groups
- [ ] Users can join groups

## 🔐 Security Notes

- The `/setup` route is publicly accessible
- Consider restricting it in production
- After creating admin user, you can remove the setup route
- Security rules are in `firestore.rules` - review and adjust as needed

## 📚 Additional Documentation

- `FIREBASE_SETUP.md` - Detailed Firebase setup
- `ADMIN_SETUP.md` - Admin user creation guide
- `SETUP_PAGE.md` - Hidden setup page documentation

