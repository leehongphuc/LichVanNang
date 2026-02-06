import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (Singleton pattern)
let app: any;
let auth: any;
let db: any;
let messaging: any;

try {
    if (!firebaseConfig.apiKey) {
        console.warn("Firebase config missing. Features will be disabled.");
    } else {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getDatabase(app);

        // Messaging is only supported in browser environments
        if (typeof window !== "undefined") {
            isSupported().then((supported) => {
                if (supported) {
                    messaging = getMessaging(app);
                }
            });
        }
    }
} catch (error) {
    console.error("Firebase init failed:", error);
}

export { app, auth, db, messaging };
