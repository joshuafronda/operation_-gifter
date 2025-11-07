# Admin Setup Page Guide

## Hidden Admin User Creation Page

A hidden page has been created to allow creating admin users directly from the app, without needing to manually create them in Firebase Console.

## How to Access

### Option 1: Direct URL
Navigate to:
```
http://localhost:5173/setup
```
or
```
http://localhost:5173/admin-setup
```

### Option 2: From Login Page
1. Go to the login page
2. Select "Mission Control" (Admin role)
3. Click the link "Or create admin user here →" in the yellow info box

## How to Use

1. **Enable Email/Password Authentication First**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Email/Password authentication
   - Click Save

2. **Create Admin User**
   - Enter admin email (e.g., `admin@example.com`)
   - Enter password (minimum 6 characters)
   - Confirm password
   - Click "Create Admin User"

3. **Login**
   - After successful creation, you'll be automatically signed out
   - Go back to the login page
   - Use the credentials you just created to log in as admin

## Features

- ✅ Creates user account in Firebase Authentication
- ✅ Automatically sets user role as 'ADMIN' in Firestore
- ✅ Validates email format and password strength
- ✅ Checks if email already exists
- ✅ Provides helpful error messages
- ✅ Secure password handling

## Security Notes

- This page is accessible to anyone who knows the URL
- Consider restricting access in production (e.g., IP whitelist, authentication gateway)
- After creating your admin user, you can delete this page or add authentication to it
- The page uses Firebase's `createUserWithEmailAndPassword` which requires Email/Password authentication to be enabled

## Troubleshooting

### Error: "Email/Password authentication is not enabled"
**Solution**: Enable Email/Password authentication in Firebase Console first.

### Error: "Email already in use"
**Solution**: The email is already registered. You can use it to log in directly, or use a different email.

### Error: "Password is too weak"
**Solution**: Use a stronger password (at least 6 characters, consider using uppercase, lowercase, numbers, and special characters).

### Error: Firebase connection issues
**Solution**: 
- Check that your Firebase project ID is correct in `.env` file
- Verify that Firestore is enabled in your Firebase project
- Check browser console for detailed error messages

## After Setup

Once you've created your admin user:
1. Log in with the credentials you created
2. You'll have full admin access to create groups, run draws, etc.
3. Consider removing or securing the `/setup` route in production

