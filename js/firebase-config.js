/**
 * Firebase configuration for the static storefront (index.html, collections.html, etc.).
 *
 * Fill in your Firebase project values below.
 * You can find these in the Firebase Console:
 *   Project Settings → General → Your apps → SDK setup and configuration
 *
 * NOTE: Firebase client credentials are intentionally public-facing.
 *       Security is enforced by your Firestore Security Rules, not by keeping
 *       this file secret.
 *
 * Leave projectId empty ("") to disable Firebase on the static site and
 * use only the built-in static catalogue (js/data.js).
 */
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
