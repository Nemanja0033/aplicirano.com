import * as admin from 'firebase-admin';

export function initializeFirebaseAdmin(): typeof admin {
  if (!process.env.FIREBASE_ADMIN_KEY) {
    throw new Error('FIREBASE_ADMIN_KEY is not set');
  }

  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin;
}