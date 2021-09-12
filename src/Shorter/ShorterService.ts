import Ajv from 'ajv';
import { nanoid } from 'nanoid';
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import IConfigModeContainer from '../models/IConfig';
import SQDatabase from '../database/SQLDatabase';
import { validateUrl } from '../utils';

class ShorterService {
  private readonly configFile!: IConfigModeContainer;
  private readonly dbController!: SQDatabase;
  private readonly ajv: Ajv;
  private readonly requestSchema: Record<string, unknown>;
  private readonly URLBase: string = 'tier.app/';
  public server!: Express;

  /**
   * Function to create an instance of SqueezeMachine
   *
   * @param configFile - The configuration file
   * @param dbController - The Database controller object
   */
  constructor(configFile: IConfigModeContainer, dbController: SQDatabase) {
    this.ajv = new Ajv();
    this.configFile = configFile;
    this.dbController = dbController;

    this.requestSchema = {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
      required: ['url'],
      additionalProperties: false,
    };
    this.configureExpressApp();
  }

  private configureExpressApp(): void {
    this.server = express();
    this.configureServer(this.server);
    this.registerEndpoints(this.server);
  }

  /**
   * Function to start the server
   *
   */
  public async start(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      this.server.listen(this.configFile.port, () => {
        console.log('Listening to', this.configFile.port);
      });
    }
  }

  private configureServer(server: Express): void {
    server.use(express.json());
    server.use(
      express.urlencoded({
        extended: true,
      }),
    );
    server.use(
      cors({
        origin: '*',
      }),
    );
    server.use(function (_request: Request, res: Response, next: NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      next();
    });
  }

  private registerEndpoints(server: Express): void {
    server.post('/sqzm', async (request: Request, response: Response) => {
      const valid = this.ajv.validate(this.requestSchema, request.body);
      if (!valid) this.sendResponse('Invalid Post Body', 400, response);
      else {
        const validJSON = JSON.parse(JSON.stringify(request.body)) as { url: string };
        const isURLValid = validateUrl(validJSON.url);
        if (!isURLValid) this.sendResponse('Invalid URL', 400, response);
        else {
          let finalId = true;
          let shortUrl: string = this.URLBase;
          while (finalId) {
            const id = nanoid(7);
            await this.dbController
              .isShortValAlreadyInDB(id)
              .then((isPresent) => {
                if (!isPresent) {
                  finalId = false;
                  shortUrl = shortUrl.concat(id);
                  this.dbController.insertNewValue({ URL: validJSON.url, short: shortUrl }).catch((err) => {
                    this.sendResponse(err.message, 500, response);
                  });
                }
                return;
              })
              .catch((err: Error) => {
                this.sendResponse(err.message, 500, response);
              });

            if (!finalId) {
              await this.dbController.addNewVisitor();
              break;
            }
          }
          this.sendResponse(`${this.configFile.address}:${this.configFile.port}/${shortUrl}`, 200, response);
        }
      }
    });

    server.get('/' + this.URLBase + ':shortUrl', async (request: Request, response: Response) => {
      const shortUrl = this.URLBase.concat(request.params.shortUrl);
      await this.dbController.getURLFromDB(shortUrl).then((urlExists) => {
        if (!urlExists) {
          response.redirect(302, '/');
        } else {
          response.redirect(301, urlExists);
        }
      });
    });

    server.get('/visitors', async (_request: Request, response: Response) => {
      this.dbController.getTotalVisitors().then((visitors: number) => {
        response.status(200).send(visitors.toString());
      });
    });

    server.use('/', express.static('public'));

    server.get('/', (_, response: Response) => {
      response.sendFile(path.join(__dirname + '/public/index.html'));
    });

    server.get('*', function (_, response: Response) {
      response.status(404).send('Page Nor Found 404');
    });
  }

  private sendResponse(message: string, code: number, response: Response): void {
    if (response.headersSent) return;
    response.statusCode = code;
    response.send(message).end();
  }
}

export default ShorterService;
