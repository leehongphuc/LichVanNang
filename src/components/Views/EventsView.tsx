"use client";

import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function EventsView() {
    const { user } = useAuth();
    const { events, deleteEvent } = useEvents();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Cần đăng nhập</h3>
                    <p className="text-zinc-500 max-w-xs mx-auto">Vui lòng đăng nhập để xem và quản lý danh sách sự kiện của bạn.</p>
                </div>
            </div>
        );
    }

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 pt-4">
            <h2 className="text-2xl font-bold px-4 text-zinc-900 dark:text-zinc-100">Sự kiện của tôi</h2>

            {sortedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center p-6 space-y-4 opacity-70">
                    <ListTodoIcon className="w-12 h-12 text-zinc-300" />
                    <p className="text-zinc-500">Chưa có sự kiện nào sắp tới</p>
                </div>
            ) : (
                <div className="space-y-3 px-4">
                    {sortedEvents.map((event) => (
                        <div key={event.id} className="glass-card p-4 flex items-center justify-between group">
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg min-w-[3.5rem]">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                                        Thg {new Date(event.date).getMonth() + 1}
                                    </span>
                                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {new Date(event.date).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {event.lunarDate ? `Âm lịch: ${event.lunarDate}` : 'Dương lịch'}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => deleteEvent(event.id!)}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ListTodoIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="5" width="6" height="6" rx="1" />
            <path d="m3 17 2 2 4-4" />
            <path d="M13 6h8" />
            <path d="M13 12h8" />
            <path d="M13 18h8" />
        </svg>
    )
}
