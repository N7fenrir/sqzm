import { checkFileExistsSync, getConfigFile } from '../src/utils';
import config from '../configs/config.json';

const randoAddress = './configs/BlahBlah.json';
const configFileAddress = './configs/config.json';

/**
 * Utils Test Suite
 *
 * @returns - Nothing
 */
const utilsTestSuite = (): void =>
  describe('Utils function isolated tests', () => {
    test('.. function checkFileExistsSync returns FALSE if file DOES NOT EXIST', () => {
      expect(checkFileExistsSync(randoAddress)).toBe(false);
    });

    test('.. function checkFileExistsSync returns TRUE if file EXISTS', () => {
      expect(checkFileExistsSync(configFileAddress)).toBe(true);
    });

    test('.. function getConfigFile reads the file sucessfully', async () => {
      const data = await getConfigFile(configFileAddress);
      expect(data).toStrictEqual(config);
    });
  });

export default utilsTestSuite;
