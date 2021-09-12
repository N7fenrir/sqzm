import cliTestSuite from './test_cli';
import configTestSuite from './test_config';
import utilsTestSuite from './test_utils';

describe(' Test Suite for SqzrMachine ', () => {
  describe('.. Test for base file ', () => {
    utilsTestSuite();
    configTestSuite();
  });

  describe('.. Test for CLI', () => {
    cliTestSuite();
  });
});
