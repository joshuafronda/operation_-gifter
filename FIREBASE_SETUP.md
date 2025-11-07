# Firebase Setup Guide

## Prerequisites
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Enable Authentication (Email/Password and Anonymous)

## Step 1: Get Firebase Configuration

1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps" section
3. Click on the web icon (`</>`) to add a web app
4. Copy your Firebase configuration values

## Step 2: Create Environment Variables

Create a `.env` file in the root directory with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id (optional)
VITE_ADMIN_EMAIL=your-admin@email.com
```

## Step 3: Enable Authentication Methods

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Anonymous** authentication (for agents/users):
   - Click on "Anonymous"
   - Toggle "Enable" to ON
   - Click "Save"
3. Enable **Email/Password** authentication (for admin):
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"
   - **IMPORTANT**: This must be enabled or you'll get "auth/operation-not-allowed" error

## Step 4: Create Admin User

1. Go to Firebase Console → Authentication → Users
2. Click "Add user" button
3. Enter your admin email (e.g., `admin@example.com`)
4. Enter a secure password
5. Click "Add user"
6. **Credentials**: Use these email and password to log in as admin in the app

## Step 5: Deploy Firestore Security Rules

### Option A: Using Firebase CLI (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use existing `firestore.rules` file
   - Use existing `firestore.indexes.json` file

4. Deploy rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option B: Using Firebase Console

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the contents of `firestore.rules`
3. Paste into the rules editor
4. Click "Publish"

## Step 6: Create Firestore Index (Optional but Recommended)

If you see index errors in the console:

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Collection: `groups`
4. Fields:
   - `createdAt` (Descending)
5. Click "Create"

Or use the CLI:
```bash
firebase deploy --only firestore:indexes
```

## Step 7: Configure Firestore Security Rules

The security rules in `firestore.rules` provide:

- **Users Collection**: 
  - Authenticated users can read user data
  - Users can create/update their own data (except role)
  - Admins have full access

- **Groups Collection**:
  - Authenticated users can read groups
  - Only admins can create/delete groups
  - Users can update groups to join or update wishlist (before draw)
  - Only admins can run the draw (mark drawCompleted)

## Troubleshooting

### Error: "Request contains an invalid argument"
- Check that your Firebase project exists and is active
- Verify all environment variables are set correctly
- Ensure Firestore is enabled in your Firebase project

### Error: "Missing or insufficient permissions"
- Deploy the security rules (see Step 5)
- Check that authentication is enabled
- Verify the user is logged in

### Error: "Index not found"
- Create the index (see Step 6)
- Or wait for automatic index creation (may take a few minutes)

### Analytics Errors
- Analytics is disabled by default in `firebase.ts`
- To enable, uncomment the analytics code in `src/firebase.ts`
- Requires Google Analytics to be set up in Firebase

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test as Admin:
   - Click "Mission Control"
   - Enter admin email and password
   - Create a new group/mission

3. Test as User:
   - Click "I'm an Agent"
   - Enter a codename
   - Join a group using the mission codename
   - Add your wishlist

4. Test Draw:
   - As admin, click "Initiate The Draw"
   - Verify users are assigned to other users (not themselves)

