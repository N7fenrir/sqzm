import sqlite3 from 'sqlite3';
import queries from './Queries';
import { TABLES } from '../statics';
import { IVisitors, IDBRow, IURL } from '../models/IDB';

class SQLDatabase {
  private db: sqlite3.Database;

  /**
   * Creates an instance of SQDatabase
   * @param dbFile - address of the existing database, undefined for no database detected
   *
   */
  constructor(dbFile: string) {
    this.db = new sqlite3.Database(dbFile, (err: any) => {
      if (err) {
        console.log(`Error creating database at ${dbFile} Exiting`);
        throw new Error(err.message);
      }
    });
  }

  /**
   * Function to check if the table exists
   *
   * @param tableName - The table name to check
   * @returns - Returns a truthy value
   */
  public async checkIfTableExists(tableName: string): Promise<boolean> {
    return this.doesTableExist(tableName).then(async (data) => {
      if (data) return true;
      else {
        return false;
      }
    });
  }

  /**
   * Function to create table main
   *
   * @param tableName - The table name by which to create the table
   *
   */
  public async createTableURLs(tableName: string): Promise<void> {
    const query = queries.createTableURLs.replace('$T$', tableName);
    await this.db.exec(query);
  }

  /**
   * Function to create table visitors
   *
   * @param tableName - The table name by which to create the table
   *
   */
  public async createTableVisitors(tableName: string): Promise<void> {
    const query = queries.createTableVisitors.replace('$T$', tableName);
    await this.db.exec(query);
    await this.db.exec(queries.insertZeroInViews.replace('$T$', tableName));
  }

  private async doesTableExist(tableName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, tableName, (err, row) => {
        if (err === null) resolve(row !== undefined);
        else reject(err);
      });
    });
  }
}

export default SQLDatabase;
