"use client";

import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

export const requestNotificationPermission = async () => {
    if (!messaging) return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // User needs to generate this in Firebase Console -> Cloud Messaging
            });
            return token;
        }
    } catch (error) {
        console.error("An error occurred while retrieving token. ", error);
    }
    return null;
};
