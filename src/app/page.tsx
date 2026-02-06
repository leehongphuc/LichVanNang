"use client";

import { useState } from "react";
import BottomNav from "@/components/Navigation/BottomNav";
import CalendarView from "@/components/Views/CalendarView";
import EventsView from "@/components/Views/EventsView";
import SettingsView from "@/components/Views/SettingsView";
import NotificationsView from "@/components/Views/NotificationsView";

export default function Home() {
  const [activeTab, setActiveTab] = useState("calendar");

  const renderView = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView />;
      case "events":
        return <EventsView />;
      case "notifications":
        return <NotificationsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center transition-all duration-500">
      <div className="w-full flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8">
        {renderView()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
