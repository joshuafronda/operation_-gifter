# Admin Setup Guide

## Quick Setup Instructions

### 1. Enable Email/Password Authentication in Firebase

**This is REQUIRED - without this, you'll get "auth/operation-not-allowed" error**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Toggle **Enable** to **ON**
6. Click **Save**

### 2. Create Admin User

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add user** button
3. Enter:
   - **Email**: `admin@example.com` (or your preferred email)
   - **Password**: Choose a secure password
4. Click **Add user**

### 3. Login Credentials

Use the email and password you just created:
- **Email**: The email you entered in step 2
- **Password**: The password you entered in step 2

### 4. Optional: Set Environment Variable

You can set the admin email in your `.env` file:

```env
VITE_ADMIN_EMAIL=admin@example.com
```

This will pre-fill the email field in the login form.

## Troubleshooting

### Error: "auth/operation-not-allowed"
**Solution**: Email/Password authentication is not enabled in Firebase Console.
- Go to Firebase Console → Authentication → Sign-in method
- Enable Email/Password authentication
- Wait a few seconds and try again

### Error: "Invalid email or password" or "Admin user not found"
**Solution**: The admin user doesn't exist in Firebase.
- Go to Firebase Console → Authentication → Users
- Create a new user with email/password
- Use those credentials to log in

### Error: "auth/user-not-found"
**Solution**: The email you're using doesn't exist in Firebase Authentication.
- Verify the email in Firebase Console → Authentication → Users
- Make sure you're using the exact email address (case-sensitive)
- Create the user if it doesn't exist

## Testing

1. Start your app: `npm run dev`
2. Click "Mission Control" on the login page
3. Enter the admin email and password you created
4. You should be logged in and see the Admin Dashboard

## Security Note

- Keep your admin password secure
- Consider using a strong password
- Don't commit your `.env` file to version control
- The admin role is determined by the `role` field in the `users` collection in Firestore

