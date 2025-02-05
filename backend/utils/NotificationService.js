const admin = require("./firebase/firebaseAdmin.");

class NotificationService {
    static async sendNotification(deviceToken, title, body) {
        const message = {
            token: deviceToken,
            notification: {
                title: title,
                body: body,
            },
        };

        try {
            const response = await admin.messaging().send(message);
            return response;
        } catch (error) {
            console.log(error); 
            throw new Error("Error sending notification");
        }
    }
}

module.exports = { NotificationService };
