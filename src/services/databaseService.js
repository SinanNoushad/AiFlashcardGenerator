import { db } from '../config/firebase';

export default class DatabaseService {
  static async initDatabase() {
    // Firebase initializes automatically
  }

  static async saveFlashcards(flashcards) {
    const userId = "demo-user";
    const batch = db.batch();
    const deckRef = db.collection('users').doc(userId).collection('flashcards');
    
    // Remove manual ID generation - let Firebase generate document IDs
    const cardsWithTimestamps = flashcards.map(card => ({
      ...card,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    cardsWithTimestamps.forEach(card => {
      // Let Firebase generate the document ID
      const cardRef = deckRef.doc();
      batch.set(cardRef, card);
    });

    await batch.commit();
    
    // Return cards with Firebase-generated IDs
    return cardsWithTimestamps.map((card, index) => ({
      ...card,
      id: batch._writes[index].ref.id
    }));
  }

  static async getAllFlashcards() {
    const userId = "demo-user";
    const snapshot = await db.collection('users')
      .doc(userId)
      .collection('flashcards')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to JavaScript Dates
      nextReview: doc.data().nextReview.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }));
  }

  static async updateFlashcard(card) {
    const userId = "demo-user";
    await db.collection('users')
      .doc(userId)
      .collection('flashcards')
      .doc(card.id)
      .update({
        ...card,
        updatedAt: new Date()
      });
  }

  static async getStats() {
    const userId = "demo-user";
    const snapshot = await db.collection('users')
      .doc(userId)
      .collection('flashcards')
      .get();

    const cards = snapshot.docs.map(doc => ({
      ...doc.data(),
      nextReview: doc.data().nextReview.toDate()
    }));
    
    return {
      totalCards: cards.length,
      masteredCards: cards.filter(card => card.easeFactor > 2.5).length,
      dueCards: cards.filter(card => card.nextReview <= new Date()).length,
      studyStreak: 0
    };
  }
}