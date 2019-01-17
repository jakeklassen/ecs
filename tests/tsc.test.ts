import { exec } from 'child_process';
import fs from 'fs';
import 'jest';
import path from 'path';

const TSC_COMMONJS_PATH = path.resolve(__dirname, '../dist/src/ecs.js');
const TSC_COMMONJS_SOURCEMAP_PATH = path.resolve(
  __dirname,
  '../dist/src/ecs.js.map',
);

describe('tsc bundle result', () => {
  test('should generate ecs.js and ecs.js.map for commonjs modules', done => {
    // Run tsc in child process
    const forked = exec('yarn run build', (err, stdout, stderr) => {
      if (err) {
        throw err;
        done();
      }

      expect(fs.existsSync(TSC_COMMONJS_PATH)).toBeTruthy();
      expect(fs.existsSync(TSC_COMMONJS_SOURCEMAP_PATH)).toBeTruthy();
      done();
    });
  }, 10000); // Need extra time to run tsc command
});
