import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { RecentQRItem, QRConfig } from '../types';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Ensures the user has an active Firebase Auth session (anonymous fallback).
 */
export async function ensureAuthSession(): Promise<User | null> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.warn('Anonymous sign-in not available or failed:', err);
    return null;
  }
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (err) {
    console.error('Google sign-in error:', err);
    throw err;
  }
}

/**
 * Sign out
 */
export async function logOut(): Promise<void> {
  await signOut(auth);
}

/**
 * Save a QR code item to Firestore under users/{userId}/saved_qrs/{id}
 */
export async function saveQRToCloud(item: RecentQRItem, userId: string): Promise<void> {
  try {
    const itemRef = doc(db, 'users', userId, 'saved_qrs', item.id);
    await setDoc(itemRef, {
      title: item.title,
      contentType: item.contentType,
      rawContent: item.rawContent,
      dataUrl: item.dataUrl,
      timestamp: item.timestamp,
      config: item.config,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not sync QR code to cloud:', err);
  }
}

/**
 * Load all saved QR codes for a user from Firestore
 */
export async function loadQRsFromCloud(userId: string): Promise<RecentQRItem[]> {
  try {
    const colRef = collection(db, 'users', userId, 'saved_qrs');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    const items: RecentQRItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || 'Untitled QR',
        contentType: data.contentType || 'url',
        rawContent: data.rawContent || '',
        dataUrl: data.dataUrl || '',
        timestamp: data.timestamp || Date.now(),
        config: data.config as QRConfig,
      });
    });
    return items;
  } catch (err) {
    console.warn('Could not load QR codes from cloud:', err);
    return [];
  }
}

/**
 * Delete a saved QR code from Firestore
 */
export async function deleteQRFromCloud(id: string, userId: string): Promise<void> {
  try {
    const itemRef = doc(db, 'users', userId, 'saved_qrs', id);
    await deleteDoc(itemRef);
  } catch (err) {
    console.warn('Could not delete QR code from cloud:', err);
  }
}

/**
 * Publish / share a QR code publicly
 */
export async function createSharedQR(item: RecentQRItem, userId?: string): Promise<string> {
  const shareId = `share_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const shareRef = doc(db, 'shared_qrs', shareId);
  await setDoc(shareRef, {
    title: item.title,
    contentType: item.contentType,
    rawContent: item.rawContent,
    dataUrl: item.dataUrl,
    config: item.config,
    creatorId: userId || 'anonymous',
    createdAt: serverTimestamp(),
  });
  return shareId;
}

export { onAuthStateChanged };
export type { User };
