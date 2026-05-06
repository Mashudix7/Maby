import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export const getGameHistory = async (coupleId, gameId) => {
  try {
    const docRef = doc(db, 'couples', coupleId, 'game_history', gameId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().seenIds || [];
    }
    return [];
  } catch (error) {
    console.error(`Error getting game history for ${gameId}:`, error);
    return [];
  }
};

export const saveSeenQuestion = async (coupleId, gameId, questionId) => {
  try {
    const docRef = doc(db, 'couples', coupleId, 'game_history', gameId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        seenIds: arrayUnion(questionId)
      });
    } else {
      await setDoc(docRef, {
        seenIds: [questionId]
      });
    }
  } catch (error) {
    console.error(`Error saving seen question for ${gameId}:`, error);
  }
};

export const resetGameHistory = async (coupleId, gameId) => {
  try {
    const docRef = doc(db, 'couples', coupleId, 'game_history', gameId);
    await setDoc(docRef, { seenIds: [] });
  } catch (error) {
    console.error(`Error resetting game history for ${gameId}:`, error);
  }
};
