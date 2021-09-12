import SQLDatabase from '../src/database/SQLDatabase';
import fs from 'fs';
import { DEFAULT_DB_ADDRESS } from '../src/statics';

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
