import { useEffect, useState } from "react";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export interface CalendarEvent {
    id?: string;
    title: string;
    date: string; // ISO format YYYY-MM-DD
    lunarDate?: string;
    remindBefore: number; // minutes
}

export function useEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setEvents([]);
            setLoading(false);
            return;
        }

        const eventsRef = ref(db, `users/${user.uid}/events`);

        // onValue listener keeps connection open and updates in realtime
        const unsubscribe = onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedEvents = Object.entries(data).map(([key, value]: [string, any]) => ({
                    id: key,
                    ...value,
                }));
                setEvents(loadedEvents);
            } else {
                setEvents([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addEvent = async (event: Omit<CalendarEvent, "id">) => {
        if (!user) throw new Error("User must be logged in to add event");

        const eventsRef = ref(db, `users/${user.uid}/events`);
        const newEventRef = push(eventsRef);
        await set(newEventRef, event);
        return newEventRef.key;
    };

    const deleteEvent = async (id: string) => {
        if (!user) throw new Error("User must be logged in to delete event");
        const eventRef = ref(db, `users/${user.uid}/events/${id}`);
        await remove(eventRef);
    };

    return { events, loading, addEvent, deleteEvent };
}
