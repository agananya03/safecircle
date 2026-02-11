# Environment Setup Guide

Here is how to obtain the keys for your `.env` file:

## 1. Supabase & Database
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once the project is created, go to **Project Settings** > **API**.
3. Copy `Project URL` to `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy `anon` `public` key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Copy `service_role` `secret` key to `SUPABASE_SERVICE_ROLE_KEY`.
6. Go to **Project Settings** > **Database** > **Connection string** > **URI**.
7. Copy the connection string to `DATABASE_URL`. **Important:** Replace `[YOUR-PASSWORD]` with the password you set when creating the project. Use port `5432` (Transaction pooling) or `6543` (Session pooling - recommended for Prisma) as indicated.

## 2. Firebase (for FCM Push Notifications)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Click the gear icon (Settings) > **Project settings**.
4. In the **General** tab, scroll down to "Your apps" and add a **Web** app.
5. Copy `apiKey` to `NEXT_PUBLIC_FIREBASE_API_KEY`.
6. Copy `projectId` to `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
7. Copy `messagingSenderId` to `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`.
8. Copy `appId` to `NEXT_PUBLIC_FIREBASE_APP_ID`.

## 3. Mapbox
1. Go to [Mapbox](https://www.mapbox.com/) and sign up.
2. Go to your **Account** page.
3. Under **Access tokens**, copy the `Default public token` to `NEXT_PUBLIC_MAPBOX_TOKEN`.

## 4. Twilio (Optional)
1. Go to [Twilio](https://www.twilio.com/) and sign up.
2. On your **Console Dashboard**, find your **Account Info**.
3. Copy `Account SID` to `TWILIO_ACCOUNT_SID`.
4. Copy `Auth Token` to `TWILIO_AUTH_TOKEN`.
5. Get a trial phone number and copy it to `TWILIO_PHONE_NUMBER`.

## 5. JWT Secret
1. You can generate a random string for `JWT_SECRET`.
2. Open your terminal (PowerShell) and run:
   ```powershell
   [Guid]::NewGuid().ToString()
   ```
   Or simply type a long random string.
