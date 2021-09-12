import SQLDatabase from '../src/database/SQLDatabase';
import fs from 'fs';
import { DEFAULT_DB_ADDRESS, TABLES } from '../src/statics';

const INMEMDB = ':memory:';
const SQL_UNIQUE_CONSTRAINT_ERROR = 'SQLITE_CONSTRAINT: UNIQUE constraint failed: URLShort.Short';

/**
 * Database Tests
 *
 */
const dbTestSuite = (): void => {
  describe('SQLDatabase', () => {
    describe('.. first check .. ', () => {
      describe('.. if the file  ', () => {
        describe('.. does not exist', () => {
          test('.. then create the file, and file existance returns true', () => {
            expect(new SQLDatabase('./db/test_db.db')).toBeInstanceOf(SQLDatabase);
            const fileExists = checkFileExistsSync('./db/test_db.db');
            expect(fileExists).toBe(true);
          });
        });

        describe('.. exists', () => {
          test('.. then open successfully', () => {
            const fileExists = checkFileExistsSync(DEFAULT_DB_ADDRESS);
            expect(fileExists).toBe(true);
            expect(new SQLDatabase(DEFAULT_DB_ADDRESS)).toBeInstanceOf(SQLDatabase);
          });
        });
      });
    });

    describe('.. on database open or create', () => {
      const db = new SQLDatabase(INMEMDB);

      describe('.. When cheking the ', () => {
        describe('.. existance of table ', () => {
          test('.. ' + TABLES.main + ' return false, if it does not exist', async () => {
            const tableExists = await db.checkIfTableExists(TABLES.main);
            expect(tableExists).toBe(false);
          });

          test('... ' + TABLES.visits + ' return false if it does not exist', async () => {
            const tableExists = await db.checkIfTableExists(TABLES.visits);
            expect(tableExists).toBe(false);
          });

          describe('.. then create table ', () => {
            test('.. ' + TABLES.main, async () => {
              await db.createTableURLs(TABLES.main);
              const tableExistsAfterCreation = await db.checkIfTableExists(TABLES.main);
              expect(tableExistsAfterCreation).toBe(true);
            });

            test('.. ' + TABLES.visits, async () => {
              await db.createTableVisitors(TABLES.visits);
              const tableExistsAfterCreation = await db.checkIfTableExists(TABLES.visits);
              expect(tableExistsAfterCreation).toBe(true);
            });
          });

          describe('.. after creation of table then ', () => {
            const toInsert = { URL: 'obiwan', short: 'kenobi' };
            let tempCount = 0;
            describe('.. then on trying to insert ', () => {
              describe(' .. a unique value', () => {
                test('.. for the first time, resolve to true', () => {
                  db.checkIfTableExists(TABLES.main).then(async (done) => {
                    if (done) {
                      expect(db.insertNewValue(toInsert)).resolves.toBe(true);
                    }
                  });
                });

                test('.. for the second time, reject with ERROR MESSAGE ', () => {
                  db.checkIfTableExists(TABLES.main).then(async (done) => {
                    if (done) {
                      expect(db.insertNewValue(toInsert)).rejects.toEqual(SQL_UNIQUE_CONSTRAINT_ERROR);
                    }
                  });
                });
              });

              test('.. updating the visitors counter', () => {
                db.checkIfTableExists(TABLES.visits).then(async (done) => {
                  if (done) {
                    const visitorAdded = await db.addNewVisitor();
                    tempCount = tempCount + 1;
                    expect(visitorAdded).toBe(true);
                  }
                });
              });
            });

            describe('.. then check the db table for a value ', () => {
              test('.. if it exists, then return true', () => {
                db.checkIfTableExists(TABLES.main).then(async (done) => {
                  if (done) {
                    expect(db.isShortValAlreadyInDB(toInsert.short)).resolves.toBe(true);
                  }
                });
              });

              test('.. if it does not exist, then return false', () => {
                db.checkIfTableExists(TABLES.main).then(async (done) => {
                  if (done) {
                    expect(db.isShortValAlreadyInDB('Vader')).resolves.toBe(false);
                  }
                });
              });

              test('.. of visitors', () => {
                db.checkIfTableExists(TABLES.visits).then(async (done) => {
                  if (done) {
                    await db.addNewVisitor();
                    tempCount = tempCount + 1;
                    await db.addNewVisitor();
                    tempCount = tempCount + 1;
                    await db.addNewVisitor();
                    tempCount = tempCount + 1;
                    expect(db.getTotalVisitors()).resolves.toEqual(tempCount);
                  }
                });
              });
            });

            describe('.. then search by the short, if the value of URL', () => {
              test('.. exists in DB, get', () => {
                db.checkIfTableExists(TABLES.main).then(async (done) => {
                  if (done) {
                    expect(db.getURLFromDB(toInsert.short)).resolves.toEqual(toInsert.URL);
                  }
                });
              });

              test('.. does not exists in db, get undefined', () => {
                db.checkIfTableExists(TABLES.main).then(async (done) => {
                  if (done) {
                    expect(db.getURLFromDB('Vader')).resolves.toEqual(undefined);
                  }
                });
              });
            });
          });
        });
      });
    });
  });
};

function checkFileExistsSync(filepath: string): boolean {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

export default dbTestSuite;
