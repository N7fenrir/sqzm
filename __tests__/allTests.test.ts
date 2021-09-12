import cliTestSuite from './test_cli';
import configTestSuite from './test_config';
import dbTestSuite from './test_db';
import utilsTestSuite from './test_utils';
import sqmTestSuite from './test_shorter';

describe(' Test Suite for SqzrMachine ', () => {
  describe('.. Test for base file ', () => {
    utilsTestSuite();
    configTestSuite();
    dbTestSuite();
  });

  describe(' API Test', () => {
    sqmTestSuite();
  });

  describe('.. Test for CLI', () => {
    cliTestSuite();
  });
});
