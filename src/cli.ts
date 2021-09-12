import { Command } from 'commander';
import { dirname } from 'path';
import { version } from '../package.json';
import SQLDatabase from './database/SQLDatabase';
import ShorterService from './Shorter/ShorterService';
import { TABLES } from './statics';
import { getConfigFile, loadDbController } from './utils';

const command = new Command('Sqzm');

interface ICmdLineArgs {
  config: string;
  database: string;
}

async function checkMainAndCreate(dbController: SQLDatabase, tableName: string) {
  const mainTableExists = await dbController.checkIfTableExists(tableName);
  if (!mainTableExists) await dbController.createTableURLs(tableName);
}

async function checkVisitorsAndCreate(dbController: SQLDatabase, tableName: string) {
  const mainTableExists = await dbController.checkIfTableExists(tableName);
  if (!mainTableExists) await dbController.createTableVisitors(tableName);
}

async function startServer(options: ICmdLineArgs) {
  console.log('Starting Sqzm...');
  const configFile = getConfigFile(options.config);
  const dbController = loadDbController(configFile.dbAddress);
  await checkMainAndCreate(dbController, TABLES.main);
  await checkVisitorsAndCreate(dbController, TABLES.visits);
  const sqms = new ShorterService(configFile, dbController);
  await sqms.start();
}

command
  .version(version)
  .command('start')
  .option('-c, --config <path>', 'File path to the config file', dirname(process.execPath))
  .action(async (options: ICmdLineArgs) => {
    await startServer(options);
  });

export default command;
