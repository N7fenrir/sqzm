import { IQueries } from '../models/IDB';

const queries: IQueries = {
  createTableURLs: `CREATE TABLE IF NOT EXISTS "$T$" (
        "id"	INTEGER ,
        "URL"	TEXT,
        "Short"	TEXT UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`,
  createTableVisitors: `CREATE TABLE IF NOT EXISTS "$T$" (
        "visitCount"	INTEGER NOT NULL,
        PRIMARY KEY("visitCount")
      );`,
  insertZeroInViews: `INSERT INTO $T$ (visitCount) VALUES (0);`,
  insertDataInTable: `INSERT INTO $T$ (URL, Short)
  VALUES ($$); `,
  checkForExistingVal: `SELECT Short FROM $T$ WHERE Short IN ('$$');`,
  getURLFromDB: `SELECT URL FROM $T$ WHERE Short IN ('$$')`,
  incrementViews: `UPDATE $T$ SET visitCount = visitCount + 1;`,
  getVisitors: `SELECT * FROM $T$`,
};

export default queries;
