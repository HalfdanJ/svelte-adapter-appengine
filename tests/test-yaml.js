import * as fs from 'node:fs';

import {describe, it} from 'mocha';

import chai from 'chai';
import chaiHttp from 'chai-http';
import process from 'node:process';

const expect = chai.expect;

chai.use(chaiHttp);

describe('app.yaml test', () => {
  it('generates correct app.yaml', () => {
    const path = process.env.TEST_DIR;
    const yaml = fs.readFileSync(path + '/build/app.yaml').toString();

    expect(yaml).to.eq(fs.readFileSync('tests/expected_app.yaml').toString());
  });

  it('generates correct package.json', () => {
    const path = process.env.TEST_DIR;
    const packageJson = fs.readFileSync(path + '/build/package.json').toString();

    expect(packageJson).to.eq(fs.readFileSync('tests/expected_package.json').toString());
  });
});
