/**
 * Firebase configuration for the static storefront (index.html, collections.html, etc.).
 *
 * ── FOR LOCAL DEVELOPMENT ──────────────────────────────────────────────────
 * Fill in your Firebase project values below. You can find them in:
 *   Firebase Console → Project Settings → General → Your apps → SDK setup
 *
 * ── FOR PRODUCTION BUILD (Vercel / CI) ────────────────────────────────────
 * Set the following environment variables in your deployment platform.
 * The build script (scripts/copy-static.js) will auto-generate this file
 * from those variables — you do NOT need to edit it manually:
 *
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 *
 * NOTE: Firebase client credentials are intentionally public-facing.
 *       Security is enforced by your Firestore Security Rules, not by keeping
 *       this file secret.
 *
 * Leave projectId as "" to disable Firebase on the static site and use only
 * the built-in static catalogue (js/data.js).
 */
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
