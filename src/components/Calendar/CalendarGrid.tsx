"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { getMonthData } from "@/lib/lunar";
import { getHoliday } from "@/lib/holidays";
import { cn } from "@/lib/utils";
import DateDetailModal from "./DateDetailModal";
import { useEvents } from "@/hooks/useEvents";



const DAYS_OF_WEEK = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"];

export default function CalendarGrid() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const { events } = useEvents();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 2, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const days = getMonthData(year, month);

    return (
        <div className="w-full max-w-6xl mx-auto glass-card p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500 transition-all">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-500/30">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold capitalize bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 drop-shadow-sm">
                            Tháng {month}, {year}
                        </h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                            {days.length} ngày • {days.filter(d => d.isToday).length ? "Hôm nay là ngày " + new Date().getDate() : "Đang xem lịch khác"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/20 dark:border-white/10 shadow-sm">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-white dark:hover:bg-zinc-700/50 rounded-full transition-all text-zinc-700 dark:text-zinc-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-4 py-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700/50 rounded-full transition-all"
                    >
                        Hôm nay
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-white dark:hover:bg-zinc-700/50 rounded-full transition-all text-zinc-700 dark:text-zinc-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-4">
                {DAYS_OF_WEEK.map((d, i) => (
                    <div
                        key={d}
                        className={cn(
                            "text-center text-sm font-bold py-3 uppercase tracking-wider drop-shadow-sm",
                            i >= 5 ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400"
                        )}
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 md:gap-3 lg:gap-4">
                {days.map((day, idx) => {
                    const solarHoliday = getHoliday(day.solarDate.getDate(), day.solarDate.getMonth() + 1, 'solar');
                    const lunarHoliday = getHoliday(day.lunarDay, day.lunarMonth, 'lunar');
                    const holiday = solarHoliday || lunarHoliday;

                    const isWeekend = day.solarDate.getDay() === 0 || day.solarDate.getDay() === 6;

                    return (
                        <div
                            key={idx}
                            onClick={() => setSelectedDate(day.solarDate)}
                            className={cn(
                                "group relative aspect-[4/5] md:aspect-square flex flex-col justify-between p-2 md:p-3 rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-sm",
                                "border border-white/10 dark:border-white/5",
                                day.isOtherMonth
                                    ? "opacity-30 grayscale hover:opacity-50"
                                    : "hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:shadow-xl hover:scale-[1.02] bg-white/40 dark:bg-black/40",
                                day.isToday && "bg-blue-50/90 dark:bg-blue-900/40 ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 z-10"
                            )}
                        >
                            {/* Top row: Solar Date */}
                            <div className="flex justify-center md:justify-start">
                                <span
                                    className={cn(
                                        "text-2xl md:text-3xl font-bold tracking-tight transition-colors drop-shadow-sm",
                                        isWeekend ? "text-red-600 dark:text-red-400" : "text-zinc-800 dark:text-zinc-100",
                                        day.isToday && "text-blue-600 dark:text-blue-400"
                                    )}
                                >
                                    {day.solarDate.getDate()}
                                </span>
                            </div>

                            {/* Middle/Bottom: Lunar & Info */}
                            <div className="flex flex-col items-center md:items-end gap-1">

                                {/* Lunar Date */}
                                <div className={cn(
                                    "flex items-center gap-1 text-[11px] md:text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-md",
                                    day.lunarDay === 1 ? "bg-amber-100/90 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" : "text-zinc-500 dark:text-zinc-400 bg-white/20 dark:bg-black/20"
                                )}>
                                    {day.lunarDay === 1 || day.lunarDay === 15 ? '🌙 ' : ''}
                                    {day.lunarDay === 1 ? `${day.lunarDay}/${day.lunarMonth}` : day.lunarDay}
                                </div>

                                {/* Holiday Badge */}
                                {holiday && (
                                    <span className="text-[9px] md:text-[10px] text-center font-bold px-1.5 py-0.5 rounded text-white bg-red-500 shadow-sm line-clamp-1 w-full md:w-auto">
                                        {holiday}
                                    </span>
                                )}

                                {/* Event Indicator */}
                                {events.some(e => e.date === day.solarDate.toISOString().split('T')[0]) && (
                                    <div className="flex gap-0.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-sm"></span>
                                    </div>
                                )}
                            </div>

                            {/* Hover Effect Light */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
                        </div>
                    );
                })}
            </div>

            {selectedDate && (
                <DateDetailModal
                    date={selectedDate}
                    isOpen={!!selectedDate}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>

    );
}
