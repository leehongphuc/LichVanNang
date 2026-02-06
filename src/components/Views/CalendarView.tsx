"use client";

import CalendarGrid from "@/components/Calendar/CalendarGrid";
import { useAuth } from "@/context/AuthContext";
import { LogIn } from "lucide-react";

export default function CalendarView() {
    const { user, loginWithGoogle } = useAuth();

    return (
        <div className="w-full max-w-6xl space-y-6 pb-24">
            {/* Top Bar - Simplified for Calendar View */}
            <div className="flex items-center justify-between glass p-4 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        Lịch Vạn Niên
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {!user && (
                    <button
                        onClick={loginWithGoogle}
                        className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-lg"
                    >
                        <LogIn className="w-4 h-4" />
                    </button>
                )}
            </div>

            <CalendarGrid />
        </div>
    );
}
