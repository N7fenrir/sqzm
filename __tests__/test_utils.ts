import fs from 'fs';
import path from 'path';
import config from '../configs/config.json';
import SQLDatabase from '../src/database/SQLDatabase';
import { DEFAULT_DB_ADDRESS } from '../src/statics';
import {
  checkFileExistsSync,
  createFolderIfItDoesNotExist,
  getConfigFile,
  loadDbController,
  validateUrl,
} from '../src/utils';

const randoAddress = './configs/BlahBlah.json';
const configFileAddress = './configs/config.json';
const randoFolder = './asdasdasdasdasd/BlahBlah.json';

/**
 * Utils Test Suite
 *
 * @returns - Nothing
 */
const utilsTestSuite = (): void =>
  describe('Utils function isolated tests', () => {
    describe('.. function checkFileExistsSyn', () => {
      test('.. c returns FALSE if file DOES NOT EXIST', () => {
        expect(checkFileExistsSync(randoAddress)).toBe(false);
      });

      test('..  returns FALSE if folder DOES NOT EXIST', () => {
        expect(checkFileExistsSync(randoFolder)).toBe(false);
      });

      test('.. returns TRUE if file EXISTS', () => {
        expect(checkFileExistsSync(configFileAddress)).toBe(true);
      });
    });

    test('.. function getConfigFile reads the file sucessfully', async () => {
      const data = await getConfigFile(configFileAddress);
      expect(data).toStrictEqual(config);
    });

    test('.. function createFolderIfItDoesNotExist creates the folder', async () => {
      expect(createFolderIfItDoesNotExist(DEFAULT_DB_ADDRESS)).toBe(true);
      expect(checkIfFolderExists(path.dirname(DEFAULT_DB_ADDRESS))).toBe(true);
    });

    describe('.. function loadDBController ', () => {
      test('.. returns the DB Handle on specific input', async () => {
        const data = loadDbController('./db/test_db.db');
        expect(data).toBeInstanceOf(SQLDatabase);
        expect(checkIfFolderExists('./db/test_db.db')).toBe(true);
        // TODO: DELETE THE FILE CREATED
      });

      test('.. returns the DB Handle at default file on undefined input', async () => {
        const data = loadDbController(undefined);
        expect(data).toBeInstanceOf(SQLDatabase);
      });
    });

    describe('.. function validateURL gets parameter "url" as ', () => {
      describe(' .. a string', () => {
        test('.. which is a random string then return false', () => {
          const valid = validateUrl('obiWanKEnobI');
          expect(valid).toBe(false);
        });

        test('.. which is a URL without protocol then return false', () => {
          const valid = validateUrl('youtube.com/watch?v=dQw4w9WgXcQ');
          expect(valid).toBe(false);
        });

        test('.. which is a correct well formed URL then return true', () => {
          const valid = validateUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
          expect(valid).toBe(true);
        });
      });
    });
  });

function checkIfFolderExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
export default utilsTestSuite;
