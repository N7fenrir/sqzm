import fs from 'fs';
import { ConfigLoader } from './config/ConfigLoader';
import IConfigModeContainer from './models/IConfig';

/**
 * Function to check if a file Exists
 *
 * @param filepath - The file path to check for existance
 *
 * @returns - Returns true if file exists
 */
export function checkFileExistsSync(filepath: string): boolean {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (e) {
    flag = false;
  }
  return flag;
}

/**
 * Function to read the file
 *
 * @param filepath - The file path to read
 *
 * @returns - Returns the config object
 *
 */
export function getConfigFile(filepath: string): IConfigModeContainer {
  return ConfigLoader.load(filepath);
}
