export interface IShort {
  short: string;
}

export interface IURL {
  URL: string;
}

export interface IVisitors {
  visitCount: number | string;
}

export interface IDBRow {
  URL: string;
  short: string;
}

export interface IQueries {
  createTableURLs: string;
  createTableVisitors: string;
  insertZeroInViews: string;
  insertDataInTable: string;
  checkForExistingVal: string;
  getURLFromDB: string;
  incrementViews: string;
  getVisitors: string;
}
