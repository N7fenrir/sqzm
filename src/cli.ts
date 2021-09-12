import { Command } from 'commander';
import { dirname } from 'path';
import { version } from '../package.json';
import { getConfigFile } from './utils';

const command = new Command('Sqzm');

interface ICmdLineArgs {
  config: string;
  database: string;
}

async function startServer(options: ICmdLineArgs) {
  console.log('Starting Sqzm...');
  const configFile = getConfigFile(options.config);
}

command
  .version(version)
  .command('start')
  .option('-c, --config <path>', 'File path to the config file', dirname(process.execPath))
  .action(async (options: ICmdLineArgs) => {
    await startServer(options);
  });

export default command;
