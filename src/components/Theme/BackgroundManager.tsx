"use client";

import { useEffect } from "react";

export const BACKGROUND_STORAGE_KEY = "calendar-app-bg";

export default function BackgroundManager() {
    useEffect(() => {
        const savedBg = localStorage.getItem(BACKGROUND_STORAGE_KEY);
        if (savedBg) {
            document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${savedBg})`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundAttachment = "fixed";
        } else {
            document.body.style.backgroundImage = "";
        }
    }, []);

    return null;
}
