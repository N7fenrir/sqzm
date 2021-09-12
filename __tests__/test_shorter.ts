import ShorterService from '../src/Shorter/ShorterService';
import supertest from 'supertest';
import { getConfigFile } from '../src/utils';
import { TABLES } from '../src/statics';
import SQDatabase from '../src/database/SQLDatabase';
import { IDBRow } from '../src/models/IDB';

const options = { config: './configs/config.json' };
let tempCount = 0;

async function checkMainAndCreate(dbController: SQDatabase, tableName: string) {
  const mainTableExists = await dbController.checkIfTableExists(tableName);
  if (!mainTableExists) await dbController.createTableURLs(tableName);
}

async function checkVisitorsAndCreate(dbController: SQDatabase, tableName: string) {
  const mainTableExists = await dbController.checkIfTableExists(tableName);
  if (!mainTableExists) await dbController.createTableVisitors(tableName);
}

const TEST_REDIRECT_INSERT: IDBRow = { URL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', short: 'tier.app/rickroll' };

/**
 * Squuze machine server test
 *
 */
const sqmTestSuite = (): void => {
  describe('Squeeze Machine Service', () => {
    const configFile = getConfigFile(options.config);
    const dbController = new SQDatabase(':memory:');
    beforeAll(async () => {
      await checkMainAndCreate(dbController, TABLES.main);
      await checkVisitorsAndCreate(dbController, TABLES.visits);
      await dbController.insertNewValue(TEST_REDIRECT_INSERT);
    });

    const sqms = new ShorterService(configFile, dbController);
    const app = supertest(sqms.server);

    describe('.. after recieving valid schema and dbController', () => {
      test('.. GET /', async () => {
        const response = await app.get('/');
        expect(response.statusCode).toBe(200);
      });

      test('.. on random get 404', async () => {
        const response = await app.get('/8q7wrhivfd');
        expect(response.statusCode).toBe(404);
      });

      describe('.. POST /sqzm', () => {
        describe('.. where body is of type ', () => {
          // Number and bool are rejected by the supertest method send

          test(' string', async () => {
            const response = await app.post('/sqzm').send('1');
            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual('Invalid Post Body');
          });

          test('.. where body is undefined ', async () => {
            const response = await app.post('/sqzm').send(undefined);
            expect(response.statusCode).toBe(400);
            expect(response.text).toEqual('Invalid Post Body');
          });

          describe('.. object', () => {
            describe('.. with invalid body types', () => {
              test('.. where body does not contain "url" key ', async () => {
                const response = await app.post('/sqzm').send({ name: 'ObiWan' });
                expect(response.statusCode).toBe(400);
                expect(response.text).toEqual('Invalid Post Body');
              });

              test('.. where body does not contain "url" key with other many keys ', async () => {
                const response = await app
                  .post('/sqzm')
                  .send({ name: 'ObiWan', time: '5946', asd: 'asd', sd: 'asdasd' });
                expect(response.statusCode).toBe(400);
                expect(response.text).toEqual('Invalid Post Body');
              });
              test('.. where body  object is empty', async () => {
                const response = await app.post('/sqzm').send({});
                expect(response.statusCode).toBe(400);
                expect(response.text).toEqual('Invalid Post Body');
              });
            });

            describe('.. with valid body type', () => {
              describe('.. where body has "url" key ', () => {
                test('.. and URL is invalid', async () => {
                  const response = await app.post('/sqzm').send({ url: 'ObiWan' });
                  expect(response.statusCode).toBe(400);
                  expect(response.text).toEqual('Invalid URL');
                });

                test('.. and URL is valid', async () => {
                  const response = await app.post('/sqzm').send({ url: TEST_REDIRECT_INSERT.URL });
                  tempCount = tempCount + 1;
                  expect(response.statusCode).toBe(200);
                });
              });
            });
          });
        });

        describe('.. on Every valid visit to /sqzmi ', () => {
          test(' .. increment visitors', async () => {
            const urls = ['http://google.com', 'http://youtube.com', 'http://wikipedia.com', 'http://reddit.com'];
            await app.post('/sqzm').send({ url: urls[0] });
            tempCount = tempCount + 1;
            await app.post('/sqzm').send({ url: urls[1] });
            tempCount = tempCount + 1;
            await app.post('/sqzm').send({ url: urls[2] });
            tempCount = tempCount + 1;
            await app.post('/sqzm').send({ url: urls[3] });
            tempCount = tempCount + 1;
            const visitorsResponse = await app.get('/visitors');
            expect(visitorsResponse.statusCode).toBe(200);
            expect(visitorsResponse.text).toEqual(tempCount.toString());
          });
        });
      });

      describe('.. on a short url which is', () => {
        test('.. not in db, redirect to /', async () => {
          const response = await app.get('/tier.app/q90u123jnd');
          expect(response.statusCode).toBe(302);
        });

        test(' .. in db, redirect to the URL', async () => {
          const response = await app.get('/tier.app/rickroll');
          expect(response.statusCode).toBe(301);
        });
      });
    });
  });
};

export default sqmTestSuite;
