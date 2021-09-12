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
            expect(data.exitCode).toBe(0);
            expect(data.stderr).toBe('');
          })
          .catch((err) => {
            expect(err.killed).toBe(true);
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
              console.log('ERR', err);
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
};

function startProcess(command: string) {
  const subprocess = execa(command);
  return subprocess;
}

export default cliTestSuite;
