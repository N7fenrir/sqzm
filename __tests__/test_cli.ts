import execa from 'execa';

/**
 *  fasd
 */
const cliTestSuite = (): void => {
  describe('Commander Test Suite', () => {
    test('.. runs the process and takes the command line argument', async () => {
      const command = 'node -r ts-node/register ./src/index.ts start -c ./configs/dev.json';
      const subprocess = startProcess(command);
      try {
        await subprocess
          .then((data) => {
            expect(data.command).toEqual(command);
          })
          .catch((err) => {
            expect(err.failed).toBe(true);
          });
      } catch (error: any) {
        expect(subprocess.killed).toBe(true);
        expect(error).not.toBe(null);
      } finally {
        subprocess.cancel();
      }
    });

    describe('.. after taking the command line argument ', () => {
      test('.. runs function "startServer" ', async () => {
        const command = 'node -r ts-node/register ./src/index.ts start -c ./configs/config.json';
        const subprocess = startProcess(command);

        try {
          await subprocess
            .then(async (data) => {
              expect(data.exitCode).toBe(0);
              expect(data.stderr).toBe('');
              expect(data.stdout).toBe('Starting Sqzm...');
            })
            .catch((err) => {
              expect(err.failed).toBe(true);
            });
        } catch (error: any) {
          expect(subprocess.killed).toBe(true);
          expect(error).not.toBe(null);
        } finally {
          subprocess.cancel();
        }
      });

      describe('.. then', () => {
        test('.. on non-exsitant config file does throws an error', async () => {
          const command = 'node -r ts-node/register ./src/index.ts start -c ./asdasdasd/config.json';
          const subprocess = startProcess(command);
          try {
            await subprocess
              .then((data) => {
                expect(data.stderr).not.toBe('');
              })
              .catch((err) => {
                expect(err.failed).toBe(true);
              });
          } catch (error: any) {
            expect(error).not.toBe('');
          } finally {
            subprocess.cancel();
          }
        });

        describe('.. on normal config file ', () => {
          test('.. does not throw an error', async () => {
            const command = 'node -r ts-node/register ./src/index.ts start -c ./configs/config.json';
            const subprocess = startProcess(command);
            try {
              await subprocess
                .then((data) => {
                  expect(data.exitCode).toBe(0);
                  expect(data.stderr).toBe('');
                })
                .catch((err) => {
                  console.log('err', err);
                  expect(err.killed).toBe(true);
                });
            } catch (error: any) {
              expect(subprocess.killed).toBe(true);
              expect(error).not.toBe(null);
            } finally {
              subprocess.cancel();
            }
          });
        });
      });
    });
  });
};

function startProcess(command: string) {
  const subprocess = execa(command);
  return subprocess;
}

export default cliTestSuite;
