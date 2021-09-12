import fs from 'fs';
import path from 'path';
import { ConfigLoader } from './config/ConfigLoader';
import SQLDatabase from './database/SQLDatabase';
import IConfigModeContainer from './models/IConfig';
import { DEFAULT_DB_ADDRESS } from './statics';

/**
 * Function to check if a file Exists
 *
 * @param filepath - The file path to check for existance
 *
 * @returns - Returns true if file exists
 */
export function checkFileExistsSync(filepath: string): boolean {
  let flag = false;
  const folderExists = checkIfFolderExists(filepath);
  if (folderExists) {
    try {
      fs.accessSync(filepath, fs.constants.F_OK);
      flag = true;
    } catch (e) {
      flag = false;
    }
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

/**
 * Function to instantisize the DB controller based on if the file is available already
 *
 * @param filePath - The file path to the database sql file
 * @returns - Returns an object of the SQLDatabase
 */
export function loadDbController(filePath: string | undefined): SQLDatabase {
  if (filePath && filePath !== '') {
    const folderExists = verifyIfTheGivenAddressExists(filePath);
    const dbFile = folderExists ? filePath : DEFAULT_DB_ADDRESS;
    return new SQLDatabase(dbFile);
  } else {
    return new SQLDatabase(DEFAULT_DB_ADDRESS);
  }
}

/**
 * Function to create a folder if it does not exist
 *
 * @param filePath - The path to check for if the folder exists and create it
 * @returns - True
 *
 */
export function createFolderIfItDoesNotExist(filePath: string): boolean {
  if (filePath !== '') {
    const folderAndFileExists = verifyIfTheGivenAddressExists(filePath);
    if (!folderAndFileExists) {
      const createFolder = folderCreated(path.dirname(filePath));
      return createFolder;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

function checkIfFolderExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
function verifyIfTheGivenAddressExists(filePath: string): boolean {
  const folderName = path.dirname(filePath);
  const folderExists = checkIfFolderExists(folderName);
  return folderExists;
}

function folderCreated(filePath: string): boolean {
  let flag = false;
  try {
    fs.mkdirSync(filePath, { recursive: true });
    flag = true;
  } catch (error: unknown) {
    throw new Error('Error Creating Folder');
  }
  return flag;
}
