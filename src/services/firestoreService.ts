import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, LogTransaksi, RewardItem, LogPenukaran } from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REWARDS, 
  INITIAL_REDEMPTIONS 
} from '../data/initialData';

// Collection References
export const USERS_COL = 'users';
export const TRANSACTIONS_COL = 'transactions';
export const REWARDS_COL = 'rewards';
export const REDEMPTIONS_COL = 'redemptions';

/**
 * Checks if the Firestore database is empty, and if so seeds it with initial default data
 */
export async function seedInitialFirestoreIfEmpty(): Promise<boolean> {
  try {
    const userSnapshot = await getDocs(collection(db, USERS_COL));
    if (userSnapshot.empty) {
      console.log('Database Firestore kosong, melakukan inisialisasi data awal...');
      const batch = writeBatch(db);

      // Seed Users
      INITIAL_USERS.forEach((u) => {
        const userRef = doc(db, USERS_COL, u.NISN || u.UserID);
        batch.set(userRef, u);
      });

      // Seed Transactions
      INITIAL_TRANSACTIONS.forEach((t) => {
        const trxRef = doc(db, TRANSACTIONS_COL, t.ID_Transaksi);
        batch.set(trxRef, t);
      });

      // Seed Rewards
      INITIAL_REWARDS.forEach((r) => {
        const rewRef = doc(db, REWARDS_COL, r.RewardID);
        batch.set(rewRef, r);
      });

      // Seed Redemptions
      INITIAL_REDEMPTIONS.forEach((red) => {
        const redRef = doc(db, REDEMPTIONS_COL, red.ID_Penukaran);
        batch.set(redRef, red);
      });

      await batch.commit();
      console.log('Inisialisasi Firestore berhasil.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saat seeding Firestore:', error);
    return false;
  }
}

/**
 * Realtime subscription to Users collection
 */
export function subscribeToUsers(
  onData: (users: User[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, USERS_COL);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: User[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as User);
      });
      // Sort by UserID asc
      items.sort((a, b) => a.UserID.localeCompare(b.UserID, undefined, { numeric: true }));
      onData(items);
    },
    (error) => {
      console.error('Firestore Users listener error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Realtime subscription to Transactions collection
 */
export function subscribeToTransactions(
  onData: (transactions: LogTransaksi[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, TRANSACTIONS_COL);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: LogTransaksi[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as LogTransaksi);
      });
      // Sort newest first
      items.sort((a, b) => b.Timestamp.localeCompare(a.Timestamp));
      onData(items);
    },
    (error) => {
      console.error('Firestore Transactions listener error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Realtime subscription to Rewards collection
 */
export function subscribeToRewards(
  onData: (rewards: RewardItem[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, REWARDS_COL);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: RewardItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as RewardItem);
      });
      items.sort((a, b) => a.RewardID.localeCompare(b.RewardID, undefined, { numeric: true }));
      onData(items);
    },
    (error) => {
      console.error('Firestore Rewards listener error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Realtime subscription to Redemptions collection
 */
export function subscribeToRedemptions(
  onData: (redemptions: LogPenukaran[]) => void,
  onError?: (err: Error) => void
) {
  const q = collection(db, REDEMPTIONS_COL);
  return onSnapshot(
    q,
    (snapshot) => {
      const items: LogPenukaran[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as LogPenukaran);
      });
      items.sort((a, b) => b.Timestamp.localeCompare(a.Timestamp));
      onData(items);
    },
    (error) => {
      console.error('Firestore Redemptions listener error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Save or update single User
 */
export async function saveUserCloud(user: User): Promise<void> {
  const userRef = doc(db, USERS_COL, user.NISN || user.UserID);
  await setDoc(userRef, user, { merge: true });
}

/**
 * Bulk import / save users (handles 73+ or hundreds of students with chunked batch writes)
 */
export async function bulkImportUsersCloud(
  newUsers: User[],
  mode: 'append' | 'replace'
): Promise<void> {
  if (mode === 'replace') {
    // Delete existing users first in chunks
    const snapshot = await getDocs(collection(db, USERS_COL));
    const deleteDocs = snapshot.docs;
    for (let i = 0; i < deleteDocs.length; i += 400) {
      const batch = writeBatch(db);
      deleteDocs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  // Write new users in batches of 400 (Firestore limit is 500 per batch)
  for (let i = 0; i < newUsers.length; i += 400) {
    const batch = writeBatch(db);
    const chunk = newUsers.slice(i, i + 400);
    chunk.forEach((u) => {
      const userRef = doc(db, USERS_COL, u.NISN || u.UserID);
      batch.set(userRef, u, { merge: true });
    });
    await batch.commit();
  }
}

/**
 * Delete a user by NISN or UserID
 */
export async function deleteUserCloud(userId: string, nisn?: string): Promise<void> {
  if (nisn) {
    await deleteDoc(doc(db, USERS_COL, nisn));
  }
  await deleteDoc(doc(db, USERS_COL, userId));
}

/**
 * Record a new waste transaction and update student points atomically
 */
export async function recordTransactionCloud(
  transaction: LogTransaksi,
  updatedUser?: User
): Promise<void> {
  const batch = writeBatch(db);
  const trxRef = doc(db, TRANSACTIONS_COL, transaction.ID_Transaksi);
  batch.set(trxRef, transaction);

  if (updatedUser) {
    const userRef = doc(db, USERS_COL, updatedUser.NISN || updatedUser.UserID);
    batch.set(userRef, updatedUser, { merge: true });
  }

  await batch.commit();
}

/**
 * Delete a transaction
 */
export async function deleteTransactionCloud(trxId: string): Promise<void> {
  await deleteDoc(doc(db, TRANSACTIONS_COL, trxId));
}

/**
 * Record reward redemption, update student points, and decrement reward stock atomically
 */
export async function recordRedemptionCloud(
  redemption: LogPenukaran,
  updatedUser: User,
  updatedReward: RewardItem
): Promise<void> {
  const batch = writeBatch(db);

  const redRef = doc(db, REDEMPTIONS_COL, redemption.ID_Penukaran);
  batch.set(redRef, redemption);

  const userRef = doc(db, USERS_COL, updatedUser.NISN || updatedUser.UserID);
  batch.set(userRef, updatedUser, { merge: true });

  const rewRef = doc(db, REWARDS_COL, updatedReward.RewardID);
  batch.set(rewRef, updatedReward, { merge: true });

  await batch.commit();
}

/**
 * Delete a redemption record
 */
export async function deleteRedemptionCloud(redemptionId: string): Promise<void> {
  await deleteDoc(doc(db, REDEMPTIONS_COL, redemptionId));
}

/**
 * Delete a reward item
 */
export async function deleteRewardCloud(rewardId: string): Promise<void> {
  await deleteDoc(doc(db, REWARDS_COL, rewardId));
}

/**
 * Add or update a reward item
 */
export async function saveRewardCloud(reward: RewardItem): Promise<void> {
  const ref = doc(db, REWARDS_COL, reward.RewardID);
  await setDoc(ref, reward, { merge: true });
}

/**
 * Clear a specific sheet/collection in Cloud Firestore
 */
export async function clearSheetCloud(
  sheetName: 'Users' | 'Log_Transaksi' | 'Katalog_Reward' | 'Log_Penukaran'
): Promise<void> {
  let colName = USERS_COL;
  if (sheetName === 'Log_Transaksi') colName = TRANSACTIONS_COL;
  if (sheetName === 'Katalog_Reward') colName = REWARDS_COL;
  if (sheetName === 'Log_Penukaran') colName = REDEMPTIONS_COL;

  const snapshot = await getDocs(collection(db, colName));
  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = writeBatch(db);
    docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

/**
 * Reset entire cloud database to default demo data
 */
export async function resetDatabaseCloud(): Promise<void> {
  const collections = [USERS_COL, TRANSACTIONS_COL, REWARDS_COL, REDEMPTIONS_COL];

  // Delete all existing documents
  for (const col of collections) {
    const snapshot = await getDocs(collection(db, col));
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(db);
      docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  // Re-seed default data
  const batch = writeBatch(db);

  INITIAL_USERS.forEach((u) => {
    const userRef = doc(db, USERS_COL, u.NISN || u.UserID);
    batch.set(userRef, u);
  });

  INITIAL_TRANSACTIONS.forEach((t) => {
    const trxRef = doc(db, TRANSACTIONS_COL, t.ID_Transaksi);
    batch.set(trxRef, t);
  });

  INITIAL_REWARDS.forEach((r) => {
    const rewRef = doc(db, REWARDS_COL, r.RewardID);
    batch.set(rewRef, r);
  });

  INITIAL_REDEMPTIONS.forEach((red) => {
    const redRef = doc(db, REDEMPTIONS_COL, red.ID_Penukaran);
    batch.set(redRef, red);
  });

  await batch.commit();
}
