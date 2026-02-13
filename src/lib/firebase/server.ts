import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

if (!getApps().length) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const serviceAccount = require('@/config/firebase-admin.json');

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const messaging = admin.messaging();
