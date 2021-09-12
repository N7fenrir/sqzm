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
    return await new Promise((resolve, reject) => {
      this.db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, tableName, (err, row) => {
        if (err === null) resolve(row !== undefined);
        else reject(err);
      });
    });
  }

  /**
   * Function to insert new value in the database
   *
   * @param data - The data  that is to be inserted
   *
   * @returns - Returns true if the insert is done
   */
  public async insertNewValue(data: IDBRow): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.db.exec(
        queries.insertDataInTable.replace('$$', `'${data.URL}' , '${data.short}'`).replace('$T$', TABLES.main),
        (err) => {
          if (err === null) resolve(true);
          else reject(err.message);
        },
      );
    });
  }

  /**
   * Function to insert the visit counter
   *
   * @returns - Returns a boolean if the operation is successfull
   */
  public async addNewVisitor(): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.db.exec(queries.incrementViews.replace('$T$', TABLES.visits), (err) => {
        if (err === null) resolve(true);
        else reject(err.message);
      });
    });
  }

  /**
   * Function to check if the value already exists in the db
   *
   * @param shortURL - The url to check for
   * @param callback - The call back function to call to store data from the sqlite query
   *
   * @returns - Returns a false value if the value is not presetn
   */
  public async isShortValAlreadyInDB(shortURL: string): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        const stmt = queries.checkForExistingVal.replace('$$', `${shortURL}`).replace('$T$', TABLES.main);
        this.db.get(stmt, (err, row) => {
          if (err) reject({ errDB: err, data: undefined });
          if (row === undefined) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    });
  }

  /**
   * Function to get the original URL back from the database
   *
   * @param shortURL - The short url visited
   * @returns - Returns a promise with a string of the original URL
   */
  public async getURLFromDB(shortURL: string): Promise<undefined | string> {
    return await new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        const stmt = queries.getURLFromDB.replace('$$', `${shortURL}`).replace('$T$', TABLES.main);
        this.db.get(stmt, (err, row) => {
          if (err) reject(err);
          if (row === undefined) {
            resolve(undefined);
          } else {
            resolve((row as IURL).URL);
          }
        });
      });
    });
  }

  /**
   * Get the total visitors from the db
   *
   * @returns - Returns the total number of visiotrs
   *
   */
  public async getTotalVisitors(): Promise<number> {
    return await new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        const stmt = queries.getVisitors.replace('$T$', TABLES.visits);
        this.db.get(stmt, (err, row) => {
          if (err) reject(err);
          const count = (row as IVisitors).visitCount;
          resolve(parseInt(count.toString()));
        });
      });
    });
  }

  /**
   * Function to close the db connection
   *
   */
  public closeDB(): void {
    this.db.close();
  }
}

export default SQLDatabase;
