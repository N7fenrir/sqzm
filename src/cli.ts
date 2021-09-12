import { Command } from 'commander';
import { dirname } from 'path';
import { version } from '../package.json';

const command = new Command('Sqzm');

command
  .version(version)
  .command('start')
  .option('-c, --config <path>', 'File path to the config file', dirname(process.execPath))
  .action(() => {
    console.log('runs');
  });

export default command;
