"use client";

import { useEffect, useState } from "react";

export const BACKGROUND_STORAGE_KEY = "calendar-app-bg";

export function useBackground() {
    const [bgStyle, setBgStyle] = useState<React.CSSProperties | undefined>(undefined);

    useEffect(() => {
        const savedBg = localStorage.getItem(BACKGROUND_STORAGE_KEY);
        if (savedBg) {
            setBgStyle({
                backgroundImage: `url(${savedBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            });
        }
    }, []);

    return bgStyle;
}
