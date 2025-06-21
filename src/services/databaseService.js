import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'FlashcardsDB.db';
const database_version = '1.0';
const database_displayname = 'Flashcards Database';
const database_size = 200000;

export class DatabaseService {
  static db = null;
  static isInitializing = false;
  static initPromise = null;

  static async initDatabase() {
    // If already initializing, return the existing promise
    if (this.isInitializing) {
      return this.initPromise;
    }

    // If already initialized, return immediately
    if (this.db) {
      return this.db;
    }

    try {
      this.isInitializing = true;
      this.initPromise = SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      );

      this.db = await this.initPromise;
      await this.createTables();
      console.log('Database initialized successfully');
      return this.db;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  static async createTables() {
    const createFlashcardsTable = `
      CREATE TABLE IF NOT EXISTS flashcards (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        difficulty INTEGER DEFAULT 0,
        repetitions INTEGER DEFAULT 0,
        interval INTEGER DEFAULT 1,
        easeFactor REAL DEFAULT 2.5,
        nextReview TEXT,
        createdAt TEXT,
        updatedAt TEXT
      );
    `;

    const createStatsTable = `
      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY,
        totalCards INTEGER DEFAULT 0,
        masteredCards INTEGER DEFAULT 0,
        dueCards INTEGER DEFAULT 0,
        studyStreak INTEGER DEFAULT 0,
        lastStudyDate TEXT,
        updatedAt TEXT
      );
    `;

    await this.db.executeSql(createFlashcardsTable);
    await this.db.executeSql(createStatsTable);
    await this.db.executeSql(`
      INSERT OR IGNORE INTO stats (id, updatedAt) 
      VALUES (1, datetime('now'))
    `);
  }

  static async ensureConnection() {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  static async getAllFlashcards() {
    try {
      await this.ensureConnection();
      const [results] = await this.db.executeSql('SELECT * FROM flashcards');
      const flashcards = [];
      for (let i = 0; i < results.rows.length; i++) {
        flashcards.push(results.rows.item(i));
      }
      return flashcards;
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      await this.ensureConnection();
      const [results] = await this.db.executeSql('SELECT * FROM stats WHERE id = 1');
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      return null;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  static async saveFlashcards(flashcards) {
    try {
      await this.ensureConnection();
      const savedCards = [];
      
      for (const card of flashcards) {
        const cardId = card.id.toString();
        const query = `
          INSERT INTO flashcards 
          (id, question, answer, difficulty, repetitions, interval, easeFactor, nextReview, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
          cardId,
          card.question,
          card.answer,
          card.difficulty,
          card.repetitions,
          card.interval,
          card.easeFactor,
          card.nextReview.toISOString(),
          card.createdAt.toISOString(),
          card.updatedAt.toISOString(),
        ];
        
        await this.db.executeSql(query, params);
        savedCards.push({ ...card, id: cardId });
      }
      
      return savedCards;
    } catch (error) {
      console.error('Error saving flashcards:', error);
      throw error;
    }
  }
}