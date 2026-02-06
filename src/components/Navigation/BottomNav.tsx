"use client";

import { Calendar, ListTodo, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: "calendar", label: "Lịch", icon: Calendar },
        { id: "events", label: "Sự kiện", icon: ListTodo },
        { id: "notifications", label: "Thông báo", icon: Bell },
        { id: "settings", label: "Cài đặt", icon: Settings },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 pb-safe pt-2 px-2 z-50">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 w-16",
                                isActive
                                    ? "text-blue-600 dark:text-blue-400 scale-110"
                                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all",
                                isActive && "bg-blue-100 dark:bg-blue-900/30"
                            )}>
                                <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            </div>
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
