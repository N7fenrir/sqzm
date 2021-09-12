import fs from 'fs';
import Ajv from 'ajv';
import { checkFileExistsSync } from '../utils';
import IConfigModeContainer from '../models/IConfig';

/**
 * Config loader to load the configuration.
 */
export class ConfigLoader {
  /**
   * Loads the configuration file from the given path.
   *
   * @param configFilePath - File path to the configuration file.
   * @returns The loaded configuration.
   */
  public static load(configFilePath: string): IConfigModeContainer {
    const ajv = new Ajv();

    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        port: { type: 'number' },
        address: { type: 'string' },
        dbAddress: { type: 'string' },
      },
      required: ['name', 'port', 'dbAddress', 'address'],
      additionalProperties: true,
    };
    const fileExists = checkFileExistsSync(configFilePath);
    if (!fileExists) {
      throw new Error('File Does not Exist');
    } else {
      const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
      const valid = ajv.validate(schema, config);
      if (!valid) {
        throw new Error('Invalid config file');
      } else {
        return {
          name: config.name,
          port: config.port,
          dbAddress: config.dbAddress,
          address: config.address,
        } as IConfigModeContainer;
      }
    }
  }
}
