"use client";

import { BellOff } from "lucide-react";

export default function NotificationsView() {
    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 pt-4">
            <h2 className="text-2xl font-bold px-4 text-zinc-900 dark:text-zinc-100">Thông báo</h2>

            <div className="flex flex-col items-center justify-center py-20 text-center p-6 space-y-4 opacity-70">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <BellOff className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Chưa có thông báo</h3>
                    <p className="text-zinc-500">Các thông báo nhắc nhở sự kiện sẽ xuất hiện ở đây.</p>
                </div>
            </div>
        </div>
    );
}
