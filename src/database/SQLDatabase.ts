import sqlite3 from 'sqlite3';

class SQLDatabase {
  private db: sqlite3.Database;

  /**
   * Creates an instance of SQDatabase
   * @param dbFile - address of the existing database, undefined for no database detected
   *
   */
  constructor(dbFile: string) {
    this.db = new sqlite3.Database(dbFile, (err: Error) => {
      if (err) {
        console.log(`Error creating database at ${dbFile} Exiting`);
        throw new Error(err.message);
      }
    });
  }
}

export default SQLDatabase;
