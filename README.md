# Flower Catalogue

A static flower-catalogue storefront paired with a React/TypeScript admin panel. Products are stored in Firebase Firestore, images are hosted on Cloudinary, and the whole thing deploys to Vercel in one command.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project structure](#project-structure)
3. [Local development](#local-development)
   - [1. Clone the repo](#1-clone-the-repo)
   - [2. Set up Firebase](#2-set-up-firebase)
   - [3. Set up Cloudinary](#3-set-up-cloudinary)
   - [4. Configure environment variables](#4-configure-environment-variables)
   - [5. Configure the static storefront](#5-configure-the-static-storefront)
   - [6. Start the admin dev server](#6-start-the-admin-dev-server)
   - [7. Open the storefront](#7-open-the-storefront)
4. [Brand customisation](#brand-customisation)
5. [Production build](#production-build)
6. [Deploying to Vercel](#deploying-to-vercel)
7. [Environment variables reference](#environment-variables-reference)

---

## Prerequisites

| Tool | Minimum version |
|------|----------------|
| [Node.js](https://nodejs.org/) | 18 |
| npm | 9 |

You also need free accounts on:
- [Firebase](https://firebase.google.com/) – Firestore database + Authentication
- [Cloudinary](https://cloudinary.com/) – image uploads

---

## Project structure

```
flower-catalogue/            # repository root (david-flower-project)
├── admin/               # React + Vite admin panel (TypeScript)
│   ├── src/
│   │   └── config/brand.ts   # Brand name, contact details, social links
│   └── example.env      # Template for admin/.env
├── js/
│   └── firebase-config.js    # Firebase credentials for the static storefront
├── scripts/
│   └── copy-static.js   # Assembles the dist/ folder for deployment
├── css/ images/ content/     # Static storefront assets
├── index.html           # Storefront entry point
├── package.json         # Root build scripts
└── vercel.json          # Vercel routing config
```

---

## Local development

### 1. Clone the repo

```bash
git clone https://github.com/mederhoo-script/david-flower-project.git
cd david-flower-project
```

### 2. Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2. Enable **Firestore Database** (start in test mode while developing).
3. Enable **Authentication** and turn on the **Email/Password** provider.
4. Go to **Project Settings → General → Your apps**, add a **Web app**, and copy the SDK config values.

### 3. Set up Cloudinary

1. Log in to [Cloudinary](https://cloudinary.com) and note your **Cloud Name** from the dashboard.
2. Create an **unsigned** upload preset:
   - **Settings → Upload → Upload presets → Add upload preset**
   - Set *Signing Mode* to **Unsigned** and save.
3. Note the preset name.

### 4. Configure environment variables

Copy the example env file inside the `admin/` directory and fill in your values:

```bash
cp admin/example.env admin/.env
```

Open `admin/.env` and replace the placeholders:

```dotenv
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id   # optional

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

> **Note:** Firebase client-side credentials are intentionally public-facing. Security is enforced by your Firestore Security Rules, not by keeping these values secret.

### 5. Configure the static storefront

For local development, edit `js/firebase-config.js` directly with the same Firebase values:

```js
window.FIREBASE_CONFIG = {
  apiKey: "your_api_key",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.firebasestorage.app",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
};
```

Leave `projectId` as `""` to disable Firebase and use the built-in static catalogue from `js/data.js` instead.

### 6. Start the admin dev server

```bash
cd admin
npm install
npm run dev
```

The admin panel will be available at `http://localhost:5173`.

- Register an admin account at `http://localhost:5173/register` (first-time setup).
- Log in at `http://localhost:5173/login`.

### 7. Open the storefront

The static storefront (`index.html`, `collections.html`, etc.) can be opened directly in a browser, or served with any static file server:

```bash
# Example using npx serve (no install required)
npx serve .
```

---

## Brand customisation

Edit `admin/src/config/brand.ts` to update the shop name, tagline, contact details, and social media links:

```ts
export const brand = {
  brandName: "Your Shop Name",
  tagline: "Your tagline here",
  phone: "+1 555 000 0000",
  location: "Your City, Country",
  email: "hello@yourshop.com",
  whatsappNumber: "15550000000",   // digits only, no + or spaces
  instagram: "https://instagram.com/yourhandle",
  facebook: "https://facebook.com/yourpage",
  // ...
};
```

---

## Production build

From the project root, run:

```bash
npm run build
```

This runs two steps:
1. **`npm run build:admin`** – installs admin dependencies and compiles the React app into `admin/dist/`.
2. **`npm run copy:static`** – assembles `dist/` by copying the static storefront files and the compiled admin panel into a single directory, and generates `dist/js/firebase-config.js` from the `VITE_FIREBASE_*` environment variables.

The final output is in the `dist/` directory.

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the following **Environment Variables** in the Vercel project settings (they match the keys in `admin/example.env`):

   | Variable | Description |
   |----------|-------------|
   | `VITE_FIREBASE_API_KEY` | Firebase API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
   | `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
   | `VITE_FIREBASE_APP_ID` | Firebase app ID |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID (optional) |
   | `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

4. Vercel will automatically use the `vercel.json` configuration (`buildCommand`, `outputDirectory`, and URL rewrites).
5. Deploy — Vercel will run `npm run build` and serve the `dist/` directory.

---

## Environment variables reference

| Variable | Required | Used by | Description |
|----------|----------|---------|-------------|
| `VITE_FIREBASE_API_KEY` | ✅ | Admin + Storefront | Firebase project API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | ✅ | Admin + Storefront | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ✅ | Admin + Storefront | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | ✅ | Admin + Storefront | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Admin + Storefront | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | ✅ | Admin + Storefront | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | ☐ | Admin | Firebase Analytics measurement ID |
| `VITE_CLOUDINARY_CLOUD_NAME` | ✅ | Admin | Cloudinary cloud name for image uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | ✅ | Admin | Unsigned upload preset name |