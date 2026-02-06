"use client";

import { useAuth } from "@/context/AuthContext";
import { requestNotificationPermission } from "@/lib/notifications";
import { db } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { LogIn, LogOut, Bell, User, Moon, Sun, ChevronRight, Shield, Image } from "lucide-react";
import { useState } from "react";

export default function SettingsView() {
    const { user, loginWithGoogle, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false); // Placeholder logic for now
    const [showBgSettings, setShowBgSettings] = useState(false);

    const handleEnableNotifications = async () => {
        if (!user) return;
        const token = await requestNotificationPermission();
        if (token) {
            await update(ref(db, `users/${user.uid}`), {
                fcmToken: token
            });
            alert("Đã bật thông báo thành công!");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 pt-4">
            <h2 className="text-2xl font-bold px-4 text-zinc-900 dark:text-zinc-100">Cài đặt</h2>

            {/* Profile Section */}
            <div className="px-4">
                {user ? (
                    <div className="glass-card p-6 flex items-center gap-4">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full border-2 border-white dark:border-zinc-700 shadow-md" />
                        ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                                {user.displayName?.[0] || "U"}
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{user.displayName}</h3>
                            <p className="text-sm text-zinc-500">{user.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <LogOut className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                        </button>
                    </div>
                ) : (
                    <div className="glass-card p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mx-auto flex items-center justify-center">
                            <User className="w-8 h-8 text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Chưa đăng nhập</h3>
                            <p className="text-sm text-zinc-500">Đăng nhập để đồng bộ dữ liệu</p>
                        </div>
                        <button
                            onClick={loginWithGoogle}
                            className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl shadow-lg hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-4 h-4" />
                            Đăng nhập bằng Google
                        </button>
                    </div>
                )}
            </div>

            {/* Settings List */}
            <div className="px-4 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Chung</h4>

                <button
                    onClick={handleEnableNotifications}
                    disabled={!user}
                    className="w-full glass-card p-4 flex items-center justify-between group hover:brightness-95 transition-all disabled:opacity-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">Thông báo</p>
                            <p className="text-xs text-zinc-500">Nhận nhắc nhở sự kiện</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                </button>

                <div className="w-full glass-card overflow-hidden transition-all duration-300">
                    <button
                        onClick={() => setShowBgSettings(!showBgSettings)}
                        className="w-full p-4 flex items-center justify-between group hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg">
                                <Image className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">Hình nền</p>
                                <p className="text-xs text-zinc-500">Tùy chỉnh ảnh nền ứng dụng</p>
                            </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${showBgSettings ? "rotate-90" : ""}`} />
                    </button>

                    {showBgSettings && (
                        <div className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-3 mt-3">
                                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Xem trước</span>
                                {typeof window !== 'undefined' && localStorage.getItem("calendar-app-bg") && (
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("calendar-app-bg");
                                            window.location.reload();
                                        }}
                                        className="text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        Xóa ảnh hiện tại
                                    </button>
                                )}
                            </div>

                            <label className="relative block w-full aspect-[21/9] rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all cursor-pointer overflow-hidden group bg-zinc-50 dark:bg-zinc-800/50">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                const base64String = reader.result as string;
                                                localStorage.setItem("calendar-app-bg", base64String);
                                                window.location.reload();
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {typeof window !== 'undefined' && localStorage.getItem("calendar-app-bg") ? (
                                    <>
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${localStorage.getItem("calendar-app-bg")})` }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium text-sm">Nhấn để thay đổi</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 gap-2">
                                        <Image className="w-8 h-8 opacity-50" />
                                        <span className="text-xs font-medium">Chọn ảnh từ thiết bị</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                <div className="w-full glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">Giao diện</p>
                            <p className="text-xs text-zinc-500">Tự động theo hệ thống</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Auto</span>
                </div>

                <div className="w-full glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100">Bảo mật</p>
                            <p className="text-xs text-zinc-500">Chính sách quyền riêng tư</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                </div>
            </div>

            <div className="text-center text-xs text-zinc-400 pt-8">
                <p>Phiên bản 1.0.0</p>
                <p>Build with Next.js & Firebase</p>
            </div>
        </div>
    );
}
