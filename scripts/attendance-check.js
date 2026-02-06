const admin = require("firebase-admin");

// Initialize Firebase Admin (Using Service Account)
// In GitHub Actions, we will pass these as env vars or a JSON file
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
});

const db = admin.database();
const messaging = admin.messaging();

async function checkAndSendNotifications() {
    console.log("Checking events for notifications...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    console.log(`Target date: ${tomorrowStr}`);

    const usersSnapshot = await db.ref("users").once("value");
    const users = usersSnapshot.val();

    if (!users) {
        console.log("No users found.");
        process.exit(0);
    }

    const promises = [];

    for (const [userId, userData] of Object.entries(users)) {
        if (!userData.fcmToken || !userData.events) continue;

        for (const [eventId, event] of Object.entries(userData.events)) {
            // Logic: Check if event date matches tomorrow
            // Also need to handle 'remindBefore' properly (minutes), but for simplicity we check exact date match - 1 day
            // Or if remindBefore is set, we calculate exact trigger time. 
            // HERE: We assume we send notification at 5AM for any event occurring that day.

            if (event.date === tomorrowStr) {
                console.log(`Sending notification to user ${userId} for event ${event.title}`);
                const message = {
                    notification: {
                        title: "Sự kiện sắp tới!",
                        body: `Ngày mai: ${event.title}`,
                    },
                    token: userData.fcmToken
                };

                promises.push(
                    messaging.send(message)
                        .then((response) => console.log("Successfully sent message:", response))
                        .catch((error) => console.log("Error sending message:", error))
                );
            }
        }
    }

    await Promise.all(promises);
    console.log("Done.");
    process.exit(0);
}

checkAndSendNotifications();
