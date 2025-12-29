import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { initializeFirebaseAdmin } from 'src/infrastrucutre/firebase/firebase-config';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (): typeof admin => initializeFirebaseAdmin()!,
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
