import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Offline persistence support
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore çoklu sekme kısıtlaması nedeniyle offline önbellek tek sekmede aktif.');
    } else if (err.code === 'unimplemented') {
      console.warn('Tarayıcı IndexedDB offline depolamayı desteklemiyor.');
    }
  });
}
