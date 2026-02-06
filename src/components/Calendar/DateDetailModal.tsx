"use client";

import { X, Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { formatSolarDate, getDayDetail } from "@/lib/lunar";
import { getHoliday } from "@/lib/holidays";
import { useEvents, CalendarEvent } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";

interface DateDetailModalProps {
    date: Date;
    isOpen: boolean;
    onClose: () => void;
}

export default function DateDetailModal({ date, isOpen, onClose }: DateDetailModalProps) {
    if (!isOpen) return null;

    const { user } = useAuth();
    const { events, addEvent, deleteEvent } = useEvents();
    const [isAdding, setIsAdding] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");

    // Get localized details
    const dayDetail = getDayDetail(date);

    // Get holidays
    const solarHoliday = getHoliday(date.getDate(), date.getMonth() + 1, 'solar');
    const lunarHoliday = getHoliday(dayDetail.lunarDay, dayDetail.lunarMonth, 'lunar');
    const holiday = solarHoliday || lunarHoliday;

    const isoDate = date.toISOString().split('T')[0];
    const dateEvents = events.filter(e => e.date === isoDate);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventTitle.trim()) return;

        await addEvent({
            title: newEventTitle,
            date: isoDate,
            lunarDate: `${dayDetail.lunarDay}/${dayDetail.lunarMonth}`,
            remindBefore: 0
        });

        setNewEventTitle("");
        setIsAdding(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">

                {/* Header */}
                <div className="relative h-40 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="text-center z-10 p-4">
                        <div className="text-sm font-medium opacity-90 uppercase tracking-widest mb-1">{dayDetail.formattedSolarDate}</div>

                        {holiday ? (
                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm uppercase tracking-wide animate-pulse">
                                    {holiday}
                                </span>
                            </div>
                        ) : (
                            <div className="h-6"></div>
                        )}

                        <div className="text-5xl font-bold drop-shadow-sm">{date.getDate()}</div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Lunar Info */}
                    <div className="relative p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm uppercase tracking-wider text-zinc-500 font-semibold mb-1">Âm Lịch</h3>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-baseline gap-2">
                                    {dayDetail.lunarDay} <span className="text-xl text-zinc-400 font-medium">/ {dayDetail.lunarMonth}</span>
                                </div>
                            </div>
                            <div className="text-right space-y-0.5">
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Năm {dayDetail.canChiYear}</p>
                                <p className="text-xs text-zinc-500">Tháng {dayDetail.canChiMonth}</p>
                                <p className="text-xs text-zinc-500">Ngày {dayDetail.canChiDay}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-700 grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 uppercase">Tiết khí</span>
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{dayDetail.jieQi}</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-xs text-zinc-500 uppercase">Trực</span>
                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">{dayDetail.zhiXing}</span>
                            </div>
                        </div>
                    </div>

                    {/* Event Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Sự kiện</h3>
                            {user && (
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {!user ? (
                            <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                <p className="text-sm text-zinc-500">Đăng nhập để quản lý sự kiện</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                {isAdding && (
                                    <form onSubmit={handleSubmit} className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            placeholder="Tên sự kiện..."
                                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newEventTitle}
                                            onChange={(e) => setNewEventTitle(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsAdding(false)}
                                                className="px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={!newEventTitle.trim()}
                                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                Lưu
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {dateEvents.length === 0 && !isAdding && (
                                    <p className="text-center text-sm text-zinc-500 py-4">Chưa có sự kiện nào</p>
                                )}

                                {dateEvents.map((event) => (
                                    <div key={event.id} className="group flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl shadow-sm">
                                        <span className="font-medium text-zinc-900 dark:text-zinc-200">{event.title}</span>
                                        <button
                                            onClick={() => deleteEvent(event.id!)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
