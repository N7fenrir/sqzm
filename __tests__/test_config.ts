import { ConfigLoader } from '../src/config/ConfigLoader';

const wrongFormat = './configs/wrong.json';
const correctFormat = './configs/config.json';

/**
 * Config Test Suite
 */
const configTestSuite = (): void => {
  describe('Config Loader', () => {
    describe('.. When the function tries to load file ', () => {
      describe('.. and the file', () => {
        test('.. does not exist', () => {
          expect(() => {
            ConfigLoader.load('./asdasd');
          }).toThrow(Error('File Does not Exist'));
        });
        test('.. exists', () => {
          expect(() => {
            ConfigLoader.load(wrongFormat);
          }).not.toThrow('File Does not Exist');
        });
      });

      describe('.. if the file exists', () => {
        test('.. and it has a wrong type, then throw error', () => {
          expect(() => {
            ConfigLoader.load(wrongFormat);
          }).toThrow(Error('Invalid config file'));
        });

        test('.. with the correct type, then do not throw an error', () => {
          expect(() => {
            ConfigLoader.load(correctFormat);
          }).not.toThrow(Error);
        });
      });
    });
  });
};

export default configTestSuite;
