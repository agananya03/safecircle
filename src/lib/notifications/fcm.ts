import { messaging } from '@/lib/firebase/server';

export const sendNotification = async (token: string, title: string, body: string, data?: Record<string, string>) => {
    try {
        const response = await messaging.send({
            token,
            notification: {
                title,
                body,
            },
            data,
        });
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.log('Error sending message:', error);
        throw error;
    }
};
